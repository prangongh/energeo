import json
import random
import requests

weather_api_token = '35ff60e414294feeb1d225230192903'
weather_api_url_base = 'http://api.worldweatheronline.com/premium/v1/past-weather.ashx?'

utility_api_token = 'lwTb05nKKAiDYqSPLlbu4ECvDPSzf25a95Mlkdhk'
utility_api_url_base = 'https://developer.nrel.gov/api/utility_rates/v3.json?'

zipcode_api_token = 'EUeRKcrUMgw4IpGSTYMrubNBvCHtuwaMc4Zq9acKZEFwAEZIiZ8HScY5Sf029l7A'
zipcode_api_url_base = 'https://www.zipcodeapi.com/rest/' + zipcode_api_token + '/info.json/'

dates = []

num_of_data = 12

# Comparison Data
solar = {
    'min_solar_hours': 2.0,
    'uv_index': 6.0,
    'min_solar_energy' : 1000,
    'avg_cost': 0.10
}

wind = {
    'min_wind_speed': 6.0,
    'min_air_pressure': 1012,
    'avg_cost': 0.06
}

# Functions
def main(location):
    random_dates()
    return analyze_data(get_data(location))

def call_weather_api(location, date):
    url = weather_api_url_base + 'key=' + weather_api_token + '&q=' + location + '&date=' + date + '&tp=12' + '&format=json'
    return requests.get(url).json()

def call_utility_api(location):
    zipcode_data = call_zipcode_api(location)
    url = utility_api_url_base + 'api_key=' + utility_api_token + '&lat=' + str(zipcode_data['lat']) + '&lon=' + str(zipcode_data['lng'])
    return requests.get(url).json()

def call_zipcode_api(location):
    url = zipcode_api_url_base + location + '/degrees'
    return requests.get(url).json()

def get_data(location):
    json_data = {}
    json_data['weather'] = {}
    json_data['utility'] = {}
    for i in range(0, num_of_data):
        json_data['weather'][str(i)] = call_weather_api(location, dates[i])

    json_data['utility'] = call_utility_api(location)
    
    return json_data

def analyze_data(json_data):
    result = {}
    result['wind'] = {}
    result['solar'] = {}
    result['other'] = {}

    # Wind Data
    sum_data = 0.0
    for i in range(0, num_of_data):
        sum_data += float(json_data['weather'][str(i)]['data']['weather'][0]['hourly'][0]['windspeedMiles'])
        sum_data += float(json_data['weather'][str(i)]['data']['weather'][0]['hourly'][1]['windspeedMiles'])
    avg_wind_speed = sum_data / (num_of_data * 2)

    sum_data = 0.0
    for i in range(0, num_of_data):
        pressure = float(json_data['weather'][str(i)]['data']['weather'][0]['hourly'][1]['pressure'])
        temperature = float(json_data['weather'][str(i)]['data']['weather'][0]['maxtempC']) + 273
        sum_data +=  pressure / (287.05 * temperature)
    avg_air_pressure = sum_data / num_of_data

    # Solar Data
    sum_data = 0.0
    for i in range(0, num_of_data):
        sum_data += float(json_data['weather'][str(i)]['data']['weather'][0]['sunHour'])
    avg_sun_hours = sum_data / num_of_data

    sum_data = 0.0
    for i in range(0, num_of_data):
        sum_data += float(json_data['weather'][str(i)]['data']['weather'][0]['hourly'][1]['uvIndex'])
    avg_uv_index = sum_data / num_of_data

    sum_data = 0.0
    for i in range(0, num_of_data):
        sum_data += float(json_data['weather'][str(i)]['data']['weather'][0]['hourly'][1]['cloudcover'])
    avg_cloud_cover = sum_data / num_of_data

    current_elec_cost = json_data['utility']['outputs']['residential']
    wind_energy_savings = current_elec_cost - wind['avg_cost']
    solar_energy_savings = current_elec_cost - solar['avg_cost']

    # Scoring Wind
    wind_speed = (avg_wind_speed - wind['min_wind_speed']) / wind['min_wind_speed'] * 100
    if (wind_speed < 0):
        wind_speed = 0.0
    elif (wind_speed > 100):
        wind_speed = 100.0
    air_pressure = (avg_air_pressure - wind['min_air_pressure']) / wind['min_air_pressure'] * 1000
    if (air_pressure < 0):
        air_pressure = 0.0 
    elif (air_pressure > 100):
        air_pressure = 100.0
    wind_score = wind_speed * 0.6 + air_pressure * 0.4

    # Scoring Solar
    solar_energy = ((104 * avg_uv_index - 18.365) - solar['min_solar_energy']) / solar['min_solar_energy'] * 1000
    if (solar_energy < 0):
        solar_energy = 0.0
    elif (solar_energy > 100):
        solar_energy = 100.0
    sun_hours = (avg_sun_hours - solar['min_solar_hours']) / solar['min_solar_hours'] * 100
    if (sun_hours < 0):
        sun_hours = 0.0
    elif (sun_hours > 100):
        sun_hours = 100.0
    solar_score = sun_hours * 0.4 + solar_energy * 0.4 - avg_cloud_cover * 0.1

    result['wind'] = {
        'score': wind_score,
        'avg_wind_speed': avg_wind_speed,
        'avg_air_pressure': avg_air_pressure
    }
        
    result['solar'] = {
        'score': solar_score,
        'avg_sun_hours': avg_sun_hours,
        'avg_uv_index': avg_uv_index,
        'avg_cloud_cover': avg_cloud_cover
    }

    result['other'] = {
        'current_elec_cost': current_elec_cost,
        'wind_energy_savings': wind_energy_savings,
        'solar_energy_savings': solar_energy_savings
    }

    return result
           
def random_dates():
    year = '2018'
    for i in range(0, int(num_of_data * 0.6)):
        month = ''
        rand_month = random.randint(9, 12)
        if rand_month < 10:
            month = '0' + str(rand_month)
        else:
            month = str(rand_month)
        date = ''
        rand_date = random.randint(1, 27)
        if rand_date < 10:
            date = '0' + str(rand_date)
        else:
            date = str(rand_date)
        dates.append(year + '-' + month + '-' + date)

    year = '2019'
    for i in range(0, num_of_data - len(dates)):
        month = ''
        rand_month = random.randint(1, 3)
        if rand_month < 10:
            month = '0' + str(rand_month)
        else:
            month = str(rand_month)
        date = ''
        rand_date = random.randint(1, 27)
        if rand_date < 10:
            date = '0' + str(rand_date)
        else:
            date = str(rand_date)
        dates.append(year + '-' + month + '-' + date)

