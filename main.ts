function pošliposly () {
    while (ESP8266_IoT.wifiState(false)) {
        basic.showNumber(3)
        ESP8266_IoT.connectWifi("Host", "wifihost")
        basic.showNumber(4)
    }
    while (ESP8266_IoT.thingSpeakState(false)) {
        basic.showNumber(5)
        ESP8266_IoT.connectThingSpeak()
        basic.showNumber(6)
    }
    basic.showNumber(7)
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setData(
    "3EDHAXEIWOUZXRZ1",
    avg_prasnost,
    Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C),
    Environment.octopus_BME280(Environment.BME280_state.BME280_humidity),
    Environment.octopus_BME280(Environment.BME280_state.BME280_pressure),
    Environment.ReadLightIntensity(AnalogPin.P2)
    )
    ESP8266_IoT.uploadData()
    basic.showNumber(8)
    basic.showNumber(9)
    odeslano += 1
    basic.clearScreen()
}
function OLED_vypis () {
    OLED.clear()
    OLED.writeString("Prasnost<0.8μm:")
    OLED.writeNumNewLine(prasnost)
    OLED.writeString("Teplota:")
    OLED.writeNumNewLine(Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C))
    OLED.writeString("Vlhkost:")
    OLED.writeNumNewLine(Environment.octopus_BME280(Environment.BME280_state.BME280_humidity))
    OLED.writeString("Tlak:")
    OLED.writeNumNewLine(Environment.octopus_BME280(Environment.BME280_state.BME280_pressure))
    OLED.writeString("Světlo:")
    OLED.writeNumNewLine(Environment.ReadLightIntensity(AnalogPin.P2))
    OLED.writeString("max prach20min:")
    OLED.writeNumNewLine(max_prasnost20m)
    OLED.writeString("avg prach20min:")
    OLED.writeNumNewLine(avg_prasnost)
    OLED.writeString("20:")
    OLED.writeNum(Math.round(pocet_minut))
    OLED.writeString(" i:")
    OLED.writeNum(i)
    OLED.writeString(" odsl:")
    OLED.writeNum(odeslano)
}
let i = 0
let odeslano = 0
let avg_prasnost = 0
let pocet_minut = 0
let max_prasnost20m = 0
let prasnost = 0
basic.showNumber(1)
prasnost = 0
max_prasnost20m = 0
pocet_minut = 0.0166667
OLED.init(128, 64)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
basic.showNumber(7777777)
basic.forever(function () {
    prasnost = Environment.ReadDust(DigitalPin.P16, AnalogPin.P1)
    i += 1
    avg_prasnost = (avg_prasnost * (i - 1) + prasnost) / i
    avg_prasnost = Math.round(avg_prasnost)
    OLED_vypis()
    basic.pause(1000)
    max_prasnost20m = Math.max(max_prasnost20m, prasnost)
    pocet_minut += -1 / 60
    if (pocet_minut < 0) {
        pošliposly()
        max_prasnost20m = 0
        pocet_minut = 1
        i = 0
        avg_prasnost = 0
    }
})
