from time import time
import cv2, pandas
import requests
from datetime import datetime
import base64
import os

data_frame = None
detect_list = [None,None]
time = []
video = cv2.VideoCapture(0)

def postCapture(path, file_name):
    date_today = datetime.now().strftime("%B %d, %Y")
    current_time = datetime.now().strftime('%H:%M %p - %Ssec')
    now = datetime.now()

    with open(os.path.join(path,file_name), 'rb') as file:
        imageBase64 = base64.b64encode(file.read())
        
        url = 'http://localhost:3001/capture'

        context = {
            'date': date_today,
            'time': current_time,
            'date_time': now,
            'file': imageBase64,
            }

        requests.post(url, data = context)

    return

while True:
    current_dateTime = datetime.now()
    file_name =str(current_dateTime.hour)+str(current_dateTime.minute) + str(current_dateTime.second)


    check, frame = video.read()
    status = 0
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray,(5, 5),0)

    if data_frame is None:
        data_frame=gray
        continue
    
    delta_frame=cv2.absdiff(data_frame,gray)
    thresh_frame=cv2.threshold(delta_frame, 100, 255, cv2.THRESH_BINARY)[1]
    thresh_frame=cv2.dilate(thresh_frame, None, iterations=2)

    cnts,_=cv2.findContours(thresh_frame.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in cnts:
        if cv2.contourArea(contour) < 50000:
            continue
        status=1
        (x, y, w, h)=cv2.boundingRect(contour)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 3)
        
    detect_list.append(status)
    detect_list=detect_list[-2:]

    # Appending Start time of motion
    if detect_list[-1] == 1 and detect_list[-2] == 0:
        time.append(datetime.now())

	# Appending End time of motion
    if detect_list[-1] == 0 and detect_list[-2] == 1:
        time.append(datetime.now())
        print("MOTION DETECTED" ,datetime.now())

        date_time = datetime.now().strftime("%B-%d-%Y-%H-%M-%p-%Ssec")
        path = 'python/img/'
        file_name = date_time+'.png'

        cv2.imwrite(str(path)+str(file_name), frame)
        postCapture(path, file_name)

            
    cv2.imshow("Home Security - Camera",frame)
    key=cv2.waitKey(1)
    if key == ord('x'):
        break
    

video.release()
cv2.destroyAllWindows
