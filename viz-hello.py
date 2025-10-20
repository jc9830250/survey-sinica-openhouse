from flask import Flask,  request, render_template
import json
with open('/root/real-time-data-viz-d3-crossfilter-websocket-tutorial/rt-data-viz/static/Geojsonfiles/openhouse-gis.json') as f:
    gis_data_group = json.load(f)

app = Flask(__name__)
#@app.route("/")
#def hello():
#    return "Hello, World!"
@app.route('/user/<name>', methods=['GET'])
def queryDataMessageByName(name):
    print("type(name) : ", type(name))
    return 'String => {}'.format(name)
@app.route('/graph')
def graph():
    return render_template('index.html')

@app.route('/ryanma')
def ryanma():
    return render_template('GeoRyanMa-main/index.html')

@app.route('/ryanma-black')
def ryanmablack():
    return render_template('GeoRyanMa-main/index-black.html')
@app.route('/loc/<id>', methods=['GET'])
def querylocByid(id):
    if id == '280-data':
       return render_template('locname280.html',id = id)
    latitude = gis_data_group[id]['latitude']
    longitude = gis_data_group[id]['longitude']
    name = gis_data_group[id]['name']
    group = gis_data_group[id]['group']
    return render_template('locname.html',id = id,latitude=latitude,longitude=longitude,name=name,group=group)


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80)

