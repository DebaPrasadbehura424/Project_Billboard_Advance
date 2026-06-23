from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from easyocr import Reader
import cv2
import os
import joblib
import uuid

app = Flask(__name__)
CORS(app)

# Load Models
model = YOLO("yolov8n.pt")
reader = Reader(['en'], gpu=False)

risk_level_model = joblib.load("risk_level_model.pkl")
risk_percentage_model = joblib.load("risk_percentage_model.pkl")


@app.post("/image_detection")
def imageDetection():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    files = request.files.getlist("image")  
    description = request.form.get("description", "")

    all_detected_objects = []
    all_text_detected = []

    temp_files = []  # To keep track of temporary files for cleanup

    for file in files:
        if file.filename == "":
            continue

        # Save temporary file with unique name
        temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
        file_path = os.path.join("uploads_temp", temp_filename)
        os.makedirs("uploads_temp", exist_ok=True)
        
        file.save(file_path)
        temp_files.append(file_path)

        try:
            # YOLO Detection
            results = model(file_path)
            detected_objects = [model.names[int(box.cls)] for box in results[0].boxes]
            all_detected_objects.extend(detected_objects)

            # OCR
            img = cv2.imread(file_path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            text_detected = " ".join(reader.readtext(gray, detail=0, paragraph=True))
            all_text_detected.append(text_detected)

        except Exception as e:
            print(f"Error processing {file.filename}: {e}")
        finally:
            # Clean up temp file
            if os.path.exists(file_path):
                os.remove(file_path)

    # Combine all results
    unique_objects = list(set(all_detected_objects))  # Remove duplicates
    combined_text_detected = " ".join(all_text_detected)

    print("Detected Objects:", unique_objects)
    print("OCR Text:", combined_text_detected)

    # Prepare input for ML Models
    combined_input = f"{description} {unique_objects} {combined_text_detected}"

    # Predict Risk
    try:
        predicted_level = risk_level_model.predict([combined_input])[0]
        predicted_percentage = risk_percentage_model.predict([combined_input])[0]
    except Exception as e:
        print("ML Model Error:", e)
        predicted_level = "Medium"
        predicted_percentage = 50

    return jsonify({
        "status": "success",
        "detected_objects": unique_objects,
        "text_detected": combined_text_detected,
        "risk_level": predicted_level,
        "risk_percentage": int(predicted_percentage),
        "images_processed": len(files),
        "description_used": description
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)