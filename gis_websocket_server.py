import time
import random
import json
import datetime
import os
from tornado import websocket, web, ioloop
from datetime import timedelta
from random import randint

#paymentTypes = ["cash", "tab", "visa","mastercard","bitcoin"]
#namesArray = ['Ben', 'Jarrod', 'Vijay', 'Aziz']
clients= dict()
loc_info = {'1':{'latitude':25.05180369,'longitude':121.6158659,'name':'誠正國中'},
            '2':{'latitude':25.045074,'longitude':121.615639,'name':'中研新村'},
            '3':{'latitude':25.049543,'longitude':121.615625,'name':'南港水廠'}}
data_280_info = {
            '1':{'latitude':25.05180369,'longitude':121.6158659,'name':'誠正國中'},
            '2':{'latitude':25.045074,'longitude':121.615639,'name':'中研新村'},
            '3':{'latitude':25.049543,'longitude':121.615625,'name':'南港水廠'}}
with open('/root/real-time-data-viz-d3-crossfilter-websocket-tutorial/rt-data-viz/static/Geojsonfiles/openhouse-gis.json') as f:
    gis_data_group = json.load(f)





class WebSocketHandler(websocket.WebSocketHandler):
  # Addition for Tornado as of 2017, need the following method
  # per: http://stackoverflow.com/questions/24851207/tornado-403-get-warning-when-opening-websocket/25071488#25071488
  def check_origin(self, origin):
    return True

  #on open of this socket
  def open(self,*args):
    print ('Connection established.')
    self.id = self.get_argument("id")
    clients[self.id]={"id":self.id,"object":self}
    #ioloop to wait for 3 seconds before starting to send data
    #print(self)
    #ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=5), self.send_data)
 #close connection
  def on_close(self):
    print ('Connection closed.')

  def on_message(self, message):
        print(message)
        self.send_data(message)
  def check_origin(self, origin):
    return True

  # Our function to send new (random) data for charts
  def send_data(self,id):
    print ("Sending Data")
    #create a bunch of random data for various dimensions we want
    #qty = random.randrange(1,4)
    #total = random.randrange(30,1000)
    #tip = random.randrange(10, 100)
    #payType = paymentTypes[random.randrange(0,4)]
    #name = namesArray[random.randrange(0,4)]
    #spent = random.randrange(1,150);
    #year = random.randrange(2012,2016)
    #latitude_array = ['25.05180369','25.045074','25.049543']
    #longitude_array =['121.6158659','121.615639','121.615625']
    if id =='280-data':
      point_data = {
        'id': id,
        'data': gis_data_group
     }

    else:
      #latitude= loc_info[id]['latitude']
      #longitude=loc_info[id]['longitude']
      #name = loc_info[id]['name']
      latitude = gis_data_group[id]['latitude']
      longitude = gis_data_group[id]['longitude']
      name = gis_data_group[id]['name']
      group = gis_data_group[id]['group']
      point_data = {
    	'latitude': latitude,
        'longitude':longitude,
        'name':name,
        'id': id,
        'group': group
     }

    print (point_data)

    #write the json object to the socket
    #self.write_message(json.dumps(point_data))
    clients['map_loc']["object"].write_message(json.dumps(point_data))
    #self.write_message(id)
    #create new ioloop instance to intermittently publish data
    #ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=5), self.send_data)

if __name__ == "__main__":
  #create new web app w/ websocket endpoint available at /websocket
  print ("Starting websocket server program. Awaiting client requests to open websocket ...")
  application = web.Application([(r'/static/(.*)', web.StaticFileHandler, {'path': os.path.dirname(__file__)}),
                                 (r'/websocket', WebSocketHandler)])
  application.listen(8001)
  ioloop.IOLoop.instance().start()
