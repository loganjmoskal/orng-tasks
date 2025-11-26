import time
import zmq
import datetime
from zoneinfo import ZoneInfo # https://docs.python.org/3/library/zoneinfo.html
import tzdata # https://tzdata.readthedocs.io/en/latest/
import json

timeZoneMap = {
    "mst": "America/Denver",
    "mdt": "America/Denver",
    "pst": "America/Los_Angeles",
    "pdt": "America/Los_Angeles",
    "est": "America/New_York",
    "edt": "America/New_York",
    "utc": "UTC"
}

def timeZoneCheck(timeZoneReq):
        if timeZoneReq not in timeZoneMap:
            return "Error: Invalid timezone requested." \
            "\nValid options are: mst, mdt, pst, pdt, est, edt, utc."

        timeZoneSelect = timeZoneMap.get(timeZoneReq)
        timeZoneInfo = ZoneInfo(timeZoneSelect)

        return timeZoneInfo

def getDateTime(param):
    try:
        timeZoneReq = param.get("timeZone")
        textDateReq = param.get("textDate")
        miliTimeReq = param.get("militaryTime")

        if textDateReq:
            dateFormat = "%B %d, %Y"
        else:
            dateFormat = "%Y-%m-%d"

        # set format depending on militaryTime
        if miliTimeReq:
            timeFormat = "%H:%M"
        else:
            timeFormat = "%I:%M %p"

        # Get current date and time in selected timezone
        timeZoneInfo = timeZoneCheck(timeZoneReq)
        now = datetime.datetime.now(timeZoneInfo)
        # Use string format
        dateAndTime = now.strftime(f"{dateFormat} {timeFormat}")

        return dateAndTime
    
    # Return error message if exception occurs, send error to client
    except Exception as e:
        return f"Error: {str(e)}"


def dateTimeServer():
    print("Awaiting message from client...\n")
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5556")

    while True:
        try:
            #  Waits for message from client
            receivedMessage = socket.recv_string()
            print(f"Received message {receivedMessage}.")

            time.sleep(1)

            #  get client request, set response
            param = json.loads(receivedMessage)
            response = getDateTime(param)

            # send response to client
            socket.send_string(response)
            print(f"Sent {response} back to client.")

        # Return error message if exception occurs, send error to client 
        except Exception as e:
            errorMessage = f"Error processing request: {str(e)}"
            socket.send_string(errorMessage)
            print(errorMessage)

if __name__ == "__main__":
    dateTimeServer()
