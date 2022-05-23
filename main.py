def pošliposly():
    global odeslano
    if ESP8266_IoT.wifi_state(False):
        basic.show_number(3)
        ESP8266_IoT.connect_wifi("Host", "wifihost")
        basic.show_number(4)
    if ESP8266_IoT.thing_speak_state(False):
        basic.show_number(5)
        ESP8266_IoT.connect_thing_speak()
        basic.show_number(6)
    basic.show_number(7)
    ESP8266_IoT.set_data("3EDHAXEIWOUZXRZ1",
        avg_prasnost,
        Environment.octopus_BME280(Environment.BME280_state.BME280_TEMPERATURE_C),
        Environment.octopus_BME280(Environment.BME280_state.BME280_HUMIDITY),
        Environment.octopus_BME280(Environment.BME280_state.BME280_PRESSURE),
        Environment.read_light_intensity(AnalogPin.P2))
    basic.show_number(8)
    ESP8266_IoT.upload_data()
    basic.show_number(9)
    odeslano += 1
    basic.clear_screen()
def OLED_vypis():
    OLED.clear()
    OLED.write_string("Prasnost<0.8μm:")
    OLED.write_num_new_line(prasnost)
    OLED.write_string("Teplota:")
    OLED.write_num_new_line(Environment.octopus_BME280(Environment.BME280_state.BME280_TEMPERATURE_C))
    OLED.write_string("Vlhkost:")
    OLED.write_num_new_line(Environment.octopus_BME280(Environment.BME280_state.BME280_HUMIDITY))
    OLED.write_string("Tlak:")
    OLED.write_num_new_line(Environment.octopus_BME280(Environment.BME280_state.BME280_PRESSURE))
    OLED.write_string("Světlo:")
    OLED.write_num_new_line(Environment.read_light_intensity(AnalogPin.P2))
    OLED.write_string("max prach20min:")
    OLED.write_num_new_line(max_prasnost20m)
    OLED.write_string("avg prach20min:")
    OLED.write_num_new_line(avg_prasnost)
    OLED.write_string("20:")
    OLED.write_num(Math.round(pocet_minut))
    OLED.write_string(" i:")
    OLED.write_num(i)
    OLED.write_string(" odsl:")
    OLED.write_num(odeslano)
i = 0
odeslano = 0
avg_prasnost = 0
pocet_minut = 0
max_prasnost20m = 0
prasnost = 0
basic.show_number(1)
prasnost = 0
max_prasnost20m = 0
pocet_minut = 0.0166667
OLED.init(128, 64)
ESP8266_IoT.init_wifi(SerialPin.P8, SerialPin.P12, BaudRate.BAUD_RATE115200)
basic.show_number(2)

def on_forever():
    global prasnost, i, avg_prasnost, max_prasnost20m, pocet_minut
    prasnost = Environment.read_dust(DigitalPin.P16, AnalogPin.P1)
    i += 1
    avg_prasnost = (avg_prasnost * (i - 1) + prasnost) / i
    avg_prasnost = Math.round(avg_prasnost)
    OLED_vypis()
    basic.pause(1000)
    max_prasnost20m = max(max_prasnost20m, prasnost)
    pocet_minut += -1 / 60
    if pocet_minut < 0:
        pošliposly()
        max_prasnost20m = 0
        pocet_minut = 20.0166667
        i = 0
        avg_prasnost = 0
basic.forever(on_forever)
