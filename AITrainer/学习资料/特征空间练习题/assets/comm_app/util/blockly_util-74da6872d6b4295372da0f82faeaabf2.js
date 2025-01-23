//# sourceMappingURL=blockly_util.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
};
const blockly = {};
class CustomCategory extends Blockly.ToolboxCategory {
    constructor(c, g, l) {
        super(c, g, l)
    }
    addColourBorder_(c) {
        this.rowDiv_.style.backgroundColor = c
    }
    setSelected(c) {
        var g = this.rowDiv_.getElementsByClassName("blocklyTreeLabel")[0];
        c ? (this.rowDiv_.style.backgroundColor = "white",
        g.style.color = this.colour_,
        this.iconDom_.style.color = this.colour_) : (this.rowDiv_.style.backgroundColor = this.colour_,
        g.style.color = "white",
        this.iconDom_.style.color = "white");
        Blockly.utils.aria.setState(this.htmlDiv_, Blockly.utils.aria.State.SELECTED, c)
    }
    createIconDom_() {
        const c = document.createElement("img");
        c.src = "./logo_only.svg";
        c.alt = "Blockly Logo";
        c.width = "25";
        c.height = "25";
        return c
    }
}
blockly.util = function() {
    const c = function() {
        Blockly.Blocks.stepper_init = {
            init: function() {
                this.setColour(95);
                this.appendDummyInput().appendField("\u521d\u59cb\u5316\u6b65\u8fdb\u7535\u673a");
                this.appendValueInput("p0").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin0#");
                this.appendValueInput("p1").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin1#");
                this.appendValueInput("p2").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin2#");
                this.appendValueInput("p3").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin3#");
                this.setPreviousStatement(!0);
                this.setNextStatement(!0);
                this.setTooltip("")
            }
        };
        Blockly.Blocks.stepper_step = {
            init: function() {
                this.setColour(95);
                this.appendDummyInput().appendField("Stepper step");
                this.appendValueInput("steps").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("steps");
                this.setPreviousStatement(!0);
                this.setNextStatement(!0);
                this.setTooltip("")
            }
        };
        Blockly.Blocks.init_servo = {
            init: function() {
                this.appendDummyInput().appendField("\u521d\u59cb\u5316\u8235\u673a");
                this.appendValueInput("pin").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin#");
                this.setColour(85);
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setTooltip("Init RC servo motor");
                this.setHelpUrl("http://www.bipes.net.ebr")
            }
        };
        Blockly.Blocks.move_servo = {
            init: function() {
                this.appendDummyInput().appendField("\u8f6c\u52a8\u8235\u673a\u89d2\u5ea6");
                this.appendValueInput("pin").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("pin#");
                this.appendValueInput("angle").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("angle");
                this.setColour(85);
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setTooltip("Move RC servo motor to degrees");
                this.setHelpUrl("http://www.bipes.net.ebr")
            }
        };
        Blockly.Python.stepper_init = function(a) {
            var b = Blockly.Python.valueToCode(a, "p0", Blockly.Python.ORDER_NONE)
              , d = Blockly.Python.valueToCode(a, "p1", Blockly.Python.ORDER_NONE)
              , e = Blockly.Python.valueToCode(a, "p2", Blockly.Python.ORDER_NONE);
            a = Blockly.Python.valueToCode(a, "p3", Blockly.Python.ORDER_NONE);
            Blockly.Python.definitions_.import_machine = "import machine";
            Blockly.Python.definitions_.import_time = "import utime";
            return "\npins = [\n    machine.Pin(" + b + ", machine.Pin.OUT),  # 1\n    machine.Pin(" + d + ", machine.Pin.OUT),  # 2\n    machine.Pin(" + e + ", machine.Pin.OUT),  # 4\n    machine.Pin(" + a + ", machine.Pin.OUT),  # 8\n]\n\nphases = [ 1, 5, 4, 6, 2, 10, 8, 9 ]\n"
        }
        ;
        Blockly.Python.stepper_step = function(a) {
            return "\nfor i in range(1, " + Blockly.Python.valueToCode(a, "steps", Blockly.Python.ORDER_ATOMIC) + "):\n    for phase in phases:\n        for n, p in enumerate(pins):\n            pins[n](phase & 1 < < n)\n        time.sleep(0.001)\n"
        }
        ;
        Blockly.Python.init_servo = function(a) {
            a = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
            Blockly.Python.definitions_.import_machine = "import machine";
            return "pservo" + a + " = machine.Pin(" + a + ")\nservo" + (a + " = machine.PWM(pservo" + a + ",freq=50)\n")
        }
        ;
        Blockly.Python.move_servo = function(a) {
            var b = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
            a = Blockly.Python.valueToCode(a, "angle", Blockly.Python.ORDER_ATOMIC);
            return "servo" + b + ".duty(" + a + ")\n"
        }
    }
      , g = function() {
        Blockly.Blocks.dht_init = {
            init: function() {
                this.appendDummyInput().appendField("\u521d\u59cb\u5316 DHT \u4f20\u611f\u5668");
                this.appendDummyInput().appendField("Type").appendField(new Blockly.FieldDropdown([["DHT11", "DHT11"], ["DHT22", "DHT22"]]), "DHT_TYPE");
                this.appendValueInput("pin").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("pin#"), "DHT_PIN_MSG");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(15);
                this.setTooltip("Init DHT11 ou DHT22 sensor");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.dht_measure = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u6d4b\u8bd5 DHT11/22 \u4f20\u611f\u5668"), "MSG_MEASURE_DHT");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(15);
                this.setTooltip("Measure DHT11/22 Sensor");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.dht_read_temp = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u8bfb\u53d6 DHT11/22 \u6e29\u5ea6"), "MSG_READ_DHT_TEMP");
                this.setOutput(!0, null);
                this.setColour(15);
                this.setTooltip("Read DHT11/22 Temperature");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.dht_read_humidity = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u8bfb\u53d6 DHT11/22 \u6e7f\u5ea6"), "MSG_READ_DHT_HUMI");
                this.setOutput(!0, null);
                this.setColour(15);
                this.setTooltip("Read DHT11/22 Humidity");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Python.dht_init = function(a) {
            var b = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
            a = a.getFieldValue("DHT_TYPE");
            Blockly.Python.definitions_.import_pin = "from machine import Pin";
            Blockly.Python.definitions_.import_dht = "import dht";
            return "dhts = dht." + a + "(Pin(" + b + "))\n"
        }
        ;
        Blockly.Python.dht_measure = function(a) {
            return "dhts.measure()\n"
        }
        ;
        Blockly.Python.dht_read_temp = function(a) {
            return ["dhts.temperature()", Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.dht_read_humidity = function(a) {
            return ["dhts.humidity()", Blockly.Python.ORDER_NONE]
        }
    }
      , l = function() {
        Blockly.Blocks.dicts_create_with_item = {
            init: function() {
                this.setColour(260);
                this.setPreviousStatement(!0);
                this.setNextStatement(!0);
                this.setTooltip("");
                this.contextMenu = !1
            }
        };
        Blockly.Blocks.dict_get = {
            init: function() {
                this.setColour(260);
                this.appendValueInput("DICT").appendField("\u5728\u5b57\u5178\u4e2d");
                this.appendValueInput("ITEM").appendField("\u83b7\u53d6key\u7684\u503c");
                this.setInputsInline(!0);
                this.setOutput(!0)
            }
        };
        Blockly.Blocks.add_dict_key_value = {
            init: function() {
                this.jsonInit({
                    colour: "260",
                    args0: [{
                        type: "input_value",
                        name: "dict_name"
                    }, {
                        type: "input_value",
                        name: "dict_items"
                    }, {
                        type: "input_value",
                        name: "add_value"
                    }],
                    inputsInline: !0,
                    nextStatement: null,
                    previousStatement: null,
                    helpUrl: "",
                    tooltip: "",
                    message0: "\u5b57\u5178%1 \u6dfb\u52a0\u952e%2 \u503c%3"
                })
            }
        };
        Blockly.Python.add_dict_key_value = function(a) {
            var b = Blockly.Python.valueToCode(a, "dict_name", Blockly.Python.ORDER_ATOMIC)
              , d = Blockly.Python.valueToCode(a, "dict_items", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "add_value", Blockly.Python.ORDER_ATOMIC);
            return b + "[" + d + "] = " + a + "\n"
        }
    }
      , m = function() {
        Blockly.Blocks.delay_ms = {
            init: function() {
                this.appendValueInput("time").setCheck("Number").appendField("\u5ef6\u65f6 ms");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(140);
                this.setTooltip("Delay processing in milliseconds");
                this.setHelpUrl("http://www.bipes.net.br/")
            }
        };
        Blockly.Python.delay_ms = function(a) {
            a = Blockly.Python.valueToCode(a, "time", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.import_time = "import utime";
            return "utime.sleep_ms(" + a + ")\n"
        }
    }
      , p = function() {
        Blockly.Blocks.mqtt_init = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u521d\u59cb\u5316 MQTT client"), "BLOCK_MQTT_INIT");
                this.appendValueInput("clientid").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("client ID"), "MQTT_CLIENT_ID");
                this.appendValueInput("server").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("server address"), "MQTT_SERVER");
                this.appendValueInput("port").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("server port"), "MQTT_PORT");
                this.appendValueInput("user").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("username"), "MQTT_USER");
                this.appendValueInput("password").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("password"), "MQTT_PASSWORD");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setTooltip("Init MQTT Client");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        }; 
        Blockly.Blocks.mqtt_subscribe = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u8ba2\u9605 MQTT topic"), "BLOCK_MQTT_SUBSCRIBE");
                this.appendValueInput("topic").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("topic"), "MQTT_TOPIC");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setTooltip("Subscribe to MQTT Topic");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.mqtt_connect = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u8fde\u63a5 MQTT \u5ba2\u6237\u7aef"), "BLOCK_MQTT_CONNECT");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setTooltip("Connect the MQTT Client from Server.");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.mqtt_set_callback = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570\u63a5\u6536 MQTT \u6d88\u606f"), "BLOCK_MQTT_SET_CALLBACK");
                this.appendDummyInput().appendField("\u63a5\u6536").appendField(new Blockly.FieldVariable("callback_msg"), "MQTT_DATA_VAR").appendField("\u6765\u81ea\u4e8e").appendField(new Blockly.FieldVariable("callback_topic",null,["String"],"String"), "MQTT_TOPIC_VAR");
                this.appendStatementInput("do").appendField("do");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setInputsInline(!1);
                this.setTooltip("Callback function must have topic and msg parameters");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.mqtt_check_msg = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u68c0\u67e5MQTT\u6d88\u606f"), "BLOCK_MQTT_CHECK_MSG");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setTooltip("Check if the server has any pending messages. Non-blocking method. Subscription messages will be passed to the callback.");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Blocks.mqtt_publish_payload = {
            init: function() {
                this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("\u53d1\u9001\u6570\u636e\u5230 MQTT topic"), "BLOCK_MQTT_PUBLISH");
                this.appendValueInput("topic").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("topic"), "MQTT_TOPIC");
                this.appendValueInput("payload").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("payload"), "MQTT_PAYLOAD");
                this.setPreviousStatement(!0, null);
                this.setNextStatement(!0, null);
                this.setColour(280);
                this.setInputsInline(!1);
                this.setTooltip("Publish Payload to MQTT Server");
                this.setHelpUrl("http://www.bipes.net.br")
            }
        };
        Blockly.Python.mqtt_publish_payload = function(a) {
            var b = Blockly.Python.valueToCode(a, "topic", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "payload", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            return "mqtt_client.publish(" + b + ", " + a + ")\n"
        }
        ;
        Blockly.Python.mqtt_check_msg = function(a) {
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            return "mqtt_client.check_msg()\n"
        }
        ;
        Blockly.Python.mqtt_init = function(a) {
            var b = Blockly.Python.valueToCode(a, "clientid", Blockly.Python.ORDER_ATOMIC)
              , d = Blockly.Python.valueToCode(a, "server", Blockly.Python.ORDER_ATOMIC)
              , e = Blockly.Python.valueToCode(a, "port", Blockly.Python.ORDER_ATOMIC)
              , f = Blockly.Python.valueToCode(a, "user", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "password", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            return 0 == f.length && 0 == a.length ? "mqtt_client = MQTTClient(" + b + ", server=" + d + ", port=" + e + ")\n" : "mqtt_client = MQTTClient(" + b + ", server=" + d + ", port=" + e + ", user=" + f + ", password=" + a + ")\n"
        }
        ;
        Blockly.Python.mqtt_subscribe = function(a) {
            a = Blockly.Python.valueToCode(a, "topic", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            return "mqtt_client.subscribe(" + a + ")\n"
        }
        ;
        Blockly.Python.mqtt_connect = function(a) {
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            return "mqtt_client.connect()\n"
        }
        ;
        Blockly.Python.mqtt_set_callback = function(a) {
            for (var b = Blockly.Python.variableDB_.getName(a.getFieldValue("MQTT_DATA_VAR"), Blockly.VARIABLE_CATEGORY_NAME), d = Blockly.Python.variableDB_.getName(a.getFieldValue("MQTT_TOPIC_VAR"), Blockly.VARIABLE_CATEGORY_NAME), e = [], f, k = a.workspace, n = Blockly.Variables.allUsedVarModels(k) || [], h = 0; f = n[h]; h++)
                f = f.name,
                -1 == a.getVars().indexOf(f) && f != b && f != d && e.push(Blockly.Python.variableDB_.getName(f, Blockly.VARIABLE_CATEGORY_NAME));
            k = Blockly.Variables.allDeveloperVariables(k);
            for (h = 0; h < k.length; h++)
                e.push(Blockly.Python.variableDB_.getName(k[h], Blockly.Names.DEVELOPER_VARIABLE_TYPE));
            e.length && e.join(", ");
            Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
            Blockly.Python.definitions_.import_json = "import json";
            a = Blockly.Python.statementToCode(a, "do");
            return "mqtt_client.set_callback(" + Blockly.Python.provideFunction_("mqtt_callback", ["def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(" + d + "," + b + "):", Blockly.Python.INDENT + b + "=json.loads(" + b + ")", a]) + ")\n"
        }
    }
      , q = function() {
        Blockly.Python.esp32_support = function(a) {
            return "import machine"
        }
        ;
        Blockly.Python.esp32_led = function(a) {
            return ["import machine.Pin\nPin(" + Blockly.Python.valueToCode(a, "PIN_NUMBER", Blockly.Python.ORDER_ATOMIC) + ", Pin.OUT)", Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.turn_on_off_led = function(a) {
            const b = Blockly.Python.nameDB_.getName(a.getFieldValue("led_variable"), Blockly.Variables.NAME_TYPE);
            a = Blockly.Python.valueToCode(a, "turn_on_led", Blockly.Python.ORDER_ATOMIC);
            console.log(a);
            return "True" === a ? b + ".off()\n" : b + ".on()\n"
        }
        ;
        Blockly.Python.dht_init = function(a) {
            return code
        }
        ;
        Blockly.Python.ultra_sound_sensor = function(a) {
            return '\nimport machine\nimport utime\nfrom time import sleep\nimport math\n\n\nclass Sound_distance(object):\n    """\n    1. \u7ed9trip\u53e3\u52a0\u4e00\u4e2a>=10us\u7684\u9ad8\u7535\u5e73\u4fe1\u53f7\u8ba9\u4ed6\u5de5\u4f5c;\n    2. \u4ed6\u53d1\u5c04\u8d85\u58f0\u6ce2\u9047\u5230\u969c\u788d\u7269\u540e\u8fd4\u56de;\n    3. echo\u53e3\u4f1a\u63a5\u6536\u5230\u9ad8\u7535\u5e73\u4fe1\u53f7,\u6301\u7eed\u65f6\u95f4\u4e0e\u4e0a\u97621,2\u6b65\u9aa4\u7684\u65f6\u95f4\u6210\u6b63\u6bd4;\n    """\n    def __init__(self, trigPinNum=12, echoPinNum=13,\n                temperature=20, relative_humidity=30,\n                pressure=101.325):\n\n        self.trig = machine.Pin(trigPinNum, machine.Pin.OUT)\n        self.trig.value(0)\n\n        """\n        \u9ed8\u8ba4\u60c5\u51b5\u4e0becho.value()\u662f0;\n        \u5f53\u53d8\u62101\u65f6\u89e6\u53d1__logHandler()\u51fd\u6570,\u8bb0\u5f55\u53d8\u62101\u7684\u65f6\u95f4t1,\n        \u518d\u5f53\u53d8\u62100\u65f6\u518d\u6b21\u89e6\u53d1__logHandler()\u51fd\u6570, \u8bb0\u5f55\u53d8\u62100\u65f6\u7684\u65f6\u95f4t2,\n        """\n        self.echo = machine.Pin(echoPinNum, machine.Pin.IN)\n        self.echo.irq(\n            trigger=machine.Pin.IRQ_RISING | machine.Pin.IRQ_FALLING,\n            handler=self.__logHandler)\n\n        self.temperature = 20\n        self.relative_humidity = 30\n        self.pressure = 101.325\n        # \u8ba1\u7b97\u97f3\u901f,\u8fd4\u56de\u5355\u4f4d\u662f \u7c73/\u79d2;\n        self.vS_m_s = self.__calcSoundSpeed()\n\n        # \u521d\u59cb\u5316\u7528\u6765\u8bb0\u5f55 echo\u9ad8\u7535\u5e73\u6301\u7eed\u65f6\u95f4\u7684\u6570\u7ec4;\n        # self.logTimeArray = array.array("Q",[0 for x in range(2)])\n        self.logTimeArray = [0, 0]\n        self.index = 0\n\n    def __logHandler(self, source):\n        """        \n        0 -> \u8bb0\u5f55 \u53d81\n        1 -> \u8bb0\u5f55 \u53d82\n        """\n        thisComeInTime = utime.ticks_us()\n        if self.index > 1:\n            return\n        self.logTimeArray[self.index] = thisComeInTime\n        self.index += 1\n\n    def __calcSoundSpeed(self):\n        e = 2.71828182845904523536\n        Kelvin = 273.15\n        T = self.temperature\n        P = self.pressure * 1000.0\n        Rh = self.relative_humidity\n        T_kel = Kelvin + T\n        ENH = 3.141593 * math.pow(10,-8)*P + 1.00062 + math.sqrt(T)*5.6*math.pow(10,-7)\n        PSV1 = math.sqrt(T_kel)*1.2378847*math.pow(10,-5)-1.9121316*math.pow(10,-2)*T_kel\n        PSV2 = 33.93711047-6.3431645*math.pow(10,3)/T_kel\n        PSV = math.pow(e,PSV1)*math.pow(e,PSV2)\n        H = Rh*ENH*PSV/P\n        Xw = H/100.0\n        Xc = 400.0*math.pow(10,-6)\n\n        C1 = 0.603055*T + 331.5024 - math.sqrt(T)*5.28*math.pow(10,-4) + (0.1495874*T + 51.471935 -math.sqrt(T)*7.82*math.pow(10,-4))*Xw\n        C2 = (-1.82*math.pow(10,-7)+3.73*math.pow(10,-8)*T-math.sqrt(T)*2.93*math.pow(10,-10))*P+(-85.20931-0.228525*T+math.sqrt(T)*5.91*math.pow(10,-5))*Xc\n        C3 = math.sqrt(Xw)*2.835149 - math.sqrt(P)*2.15*math.pow(10,-13) + math.sqrt(Xc)*29.179762 + 4.86*math.pow(10,-4)*Xw*P*Xc\n        C = C1 + C2 - C3\n        return C\n\n    def get_distance(self):\n        # \u7ed9trig \u6301\u7eed10us\u7684\u9ad8\u7535\u5e73,\u89e6\u53d1\u8ba9\u5b83\u53d1\u9001\u58f0\u6ce2;\n        self.trig.value(1)\n        utime.sleep_us(10)\n        self.trig.value(0)\n\n        # index\u5f520\u51c6\u5907\u89e6\u53d1__logHandler()\u51fd\u6570\u540e\u8bb0\u5f55t1,t2;\n        self.index = 0\n\n        # \u7b49\u7ea7\u8bb0\u5f55\u5b8c\u6bd5 t1\u548ct2;\n        while self.index < 2:\n            utime.sleep_ms(100)\n\n        vS_cm_us = (self.vS_m_s * 100) / 1000000\n        vS_mm_us = (self.vS_m_s * 1000) / 1000000\n        # t2 - t1 = echo\u7684\u9ad8\u7535\u5e73\u6301\u7eed\u65f6\u95f4,\u5355\u4f4d\u5fae\u79d2;\n        time_diff = self.logTimeArray[1] - self.logTimeArray[0]\n        print("[t1, t2]: ",self.logTimeArray)\n        print("time_diff: ", time_diff)\n        distance_cm = (time_diff * vS_cm_us) / 2\n        distance_mm = (time_diff * vS_mm_us) / 2\n        print("cm: ", distance_cm, "\\nmm: ", distance_mm)\n        return [distance_cm, distance_mm]\n\nsoundDistance = Sound_distance()\n\nwhile True:\n    sleep(1)\n    soundDistance.get_distance()\n'
        }
        ;
        Blockly.Python.infrared_sensor = function(a) {
            return '\nfrom machine import Pin\nimport machine\n\n## \u8981\u63a5\u7535\u963b\npin_num = 25\ninterrupt_counter = 0\ntotal_interrupts_counter = 0\n\ndef callback(pin):\n    global interrupt_counter\n    interrupt_counter = interrupt_counter + 1\n    \np25 = Pin(pin_num, Pin.IN, Pin.PULL_UP)\np25.irq(trigger = Pin.IRQ_RISING, handler = callback)\n\nwhile True:\n    if interrupt_counter > 0:\n        state = machine.disable_irq()\n        interrupt_counter = interrupt_counter - 1\n        machine.enable_irq(state)\n        total_interrupts_counter = total_interrupts_counter + 1\n        print("Interrupt has occurred: " + str(total_interrupts_counter))\n'
        }
        ;
        Blockly.Python.servos = function(a) {
            var b = Blockly.Python.valueToCode(a, "PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "DEGREES", Blockly.Python.ORDER_ATOMIC);
            return "\nfrom machine import I2C, SoftI2C\nfrom machine import Pin\nimport ustruct\nimport time\nimport math\n\nclass PCA9685:\n    def __init__(self, i2c, address=0x40):\n        self.i2c = i2c\n        self.address = address\n        self.reset()\n\n    def _write(self, address, value):\n        self.i2c.writeto_mem(self.address, address, bytearray([value]))\n\n    def _read(self, address):\n        return self.i2c.readfrom_mem(self.address, address, 1)[0]\n\n    def reset(self):\n        self._write(0x00, 0x00) # Mode1\n\n    def freq(self, freq=None):\n\n        if freq is None:\n            return int(25000000.0 / 4096 / (self._read(0xfe) - 0.5))\n        prescale = int(25000000.0 / 4096.0 / freq + 0.5)\n        old_mode = self._read(0x00) # Mode 1\n        self._write(0x00, (old_mode & 0x7F) | 0x10) # Mode 1, sleep\n        self._write(0xfe, prescale) # Prescale\n        self._write(0x00, old_mode) # Mode 1\n        time.sleep_us(5)\n        self._write(0x00, old_mode | 0xa1) # Mode 1, autoincrement on\n\n    def pwm(self, index, on=None, off=None):\n        if on is None or off is None:\n            data = self.i2c.readfrom_mem(self.address, 0x06 + 4 * index, 4)\n            return ustruct.unpack('<HH', data)\n        data = ustruct.pack('<HH', on, off)\n        self.i2c.writeto_mem(self.address, 0x06 + 4 * index,  data)\n\n    def duty(self, index, value=None, invert=False):\n        if value is None:\n            pwm = self.pwm(index)\n            if pwm == (0, 4096):\n                value = 0\n            elif pwm == (4096, 0):\n                value = 4095\n            value = pwm[1]\n            if invert:\n                value = 4095 - value\n            return value\n        if not 0 <= value <= 4095:\n            raise ValueError(\"Out of range\")\n        if invert:\n            value = 4095 - value\n        if value == 0:\n            self.pwm(index, 0, 4096)\n        elif value == 4095:\n            self.pwm(index, 4096, 0)\n        else:\n            self.pwm(index, 0, value)\n\n\n\n\nclass Servos:\n    def __init__(self, i2c, address=0x40, freq=50, min_us=500, max_us=2500,  #\u6839\u636e\u8235\u673a\u53c2\u6570\u81ea\u884c\u8bbe\u7f6e 0 - 180\u5ea6\n                 degrees=180):\n        self.period = 1000000 / freq\n        self.min_duty = self._us2duty(min_us)\n        self.max_duty = self._us2duty(max_us)\n        self.degrees = degrees\n        self.freq = freq\n        self.pca9685 = PCA9685(i2c, address)\n        self.pca9685.freq(freq)\n\n    def _us2duty(self, value):\n        return int(4095 * value / self.period)\n\n    def position(self, index, degrees=None, radians=None, us=None, duty=None):\n        span = self.max_duty - self.min_duty\n        if degrees is not None:\n            duty = self.min_duty + span * degrees / self.degrees\n        elif radians is not None:\n            duty = self.min_duty + span * radians / math.radians(self.degrees)\n        elif us is not None:\n            duty = self._us2duty(us)\n        elif duty is not None:\n            pass\n        else:\n            return self.pca9685.duty(index)\n        duty = min(self.max_duty, max(self.min_duty, int(duty)))\n        self.pca9685.duty(index, duty)\n\n    def release(self, index):\n        self.pca9685.duty(index, 0)\n\n    def position_duty(self, index, degrees=None, radians=None, us=None, duty=None):\n        int_dutu=int(duty)\n        self.pca9685.duty(index, int_dutu)\n\nservos = Servos(SoftI2C(scl=Pin(23), sda=Pin(19), freq=100000), address=0x40) #\u8235\u673a\u63a7\u5236\u677f(\u76f4\u63d2)\n\ndef angle(pin_num, degrees):            #\u8bbe\u7f6e\u8235\u673a\u89d2\u5ea6\n    servos.position(pin_num, degrees)\n\nangle(" + b + "," + a + ")"
        }
        ;
        Blockly.Python.ad_turn_on_off_led = function(a) {
            var b = Blockly.Python.valueToCode(a, "PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "STATE", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.ad_turn_on_off_led = "\nimport time\nfrom machine import Pin\n\ndef led_light(state , pin):\n  _led = Pin(pin,Pin.OUT)\n  \n  if (state == 1):\n    _led.off()\n  elif(state == 0):\n    _led.on()\n    \n";
            return "led_light(" + a + "," + b + ")\n"
        }
        ;
        Blockly.Python.ad_thermal_humidity_sensor = function(a) {
            var b = Blockly.Python.valueToCode(a, "LED_PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "DHT_PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.ad_thermal_humidity_sensor = "\nimport time\nfrom machine import Pin\nimport dht\nimport machine\n\n# \u9700\u8981\u5728\u6253\u5f00DHT11\u5f00\u5173\u4e3aON\n# \u7ea2\u706f\u4e3a32\u5f15\u811a\uff0c\u9ed8\u8ba4\u4e3a\u9ad8\u7535\u5e73\uff0c\u706d\u706f\nled_red = Pin(" + b + ',Pin.OUT, value=1)\ndef read_dht11(dht_pin):\n  \n    dht11 = dht.DHT11(machine.Pin(dht_pin)) # \u8bf4\u660eDHT11\u63a5\u5728GPIO4\u5f15\u811a\u4e0a"\n    dht11.measure()\n    #buff="\u6e29\u5ea6:%02d \u6e7f\u5ea6:%02d" % (dht11.temperature(), dht11.humidity())\n    temp_hum_tuple = (dht11.temperature(), dht11.humidity())\n    return temp_hum_tuple\n';
            return ["read_dht11(" + a + ")", Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.ad_ultra_sound_sensor = function(a) {
            var b = Blockly.Python.valueToCode(a, "TRIG_PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "ECHO_PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.ad_ultra_sound_sensor = '\nimport machine\nimport utime\nfrom time import sleep\nimport math\n\n\nclass Sound_distance(object):\n     """\n     1. \u7ed9trip\u53e3\u52a0\u4e00\u4e2a>=10us\u7684\u9ad8\u7535\u5e73\u4fe1\u53f7\u8ba9\u4ed6\u5de5\u4f5c;\n     2. \u4ed6\u53d1\u5c04\u8d85\u58f0\u6ce2\u9047\u5230\u969c\u788d\u7269\u540e\u8fd4\u56de;\n     3. echo\u53e3\u4f1a\u63a5\u6536\u5230\u9ad8\u7535\u5e73\u4fe1\u53f7,\u6301\u7eed\u65f6\u95f4\u4e0e\u4e0a\u97621,2\u6b65\u9aa4\u7684\u65f6\u95f4\u6210\u6b63\u6bd4;\n     """\n     def __init__(self, trig_pin_num, echo_pin_num,\n                 temperature=20, relative_humidity=30,\n                 pressure=101.325):\n\n         self.trigPinNum = trig_pin_num\n         self.echoPinNUm = echo_pin_num\n         self.trig = machine.Pin(trigPinNum, machine.Pin.OUT)\n         self.trig.value(0)\n\n         """\n         \u9ed8\u8ba4\u60c5\u51b5\u4e0becho.value()\u662f0;\n         \u5f53\u53d8\u62101\u65f6\u89e6\u53d1__logHandler()\u51fd\u6570,\u8bb0\u5f55\u53d8\u62101\u7684\u65f6\u95f4t1,\n         \u518d\u5f53\u53d8\u62100\u65f6\u518d\u6b21\u89e6\u53d1__logHandler()\u51fd\u6570, \u8bb0\u5f55\u53d8\u62100\u65f6\u7684\u65f6\u95f4t2,\n         """\n         self.echo = machine.Pin(echoPinNum, machine.Pin.IN)\n         self.echo.irq(\n             trigger=machine.Pin.IRQ_RISING | machine.Pin.IRQ_FALLING,\n             handler=self.__logHandler)\n\n         self.temperature = 20\n         self.relative_humidity = 30\n         self.pressure = 101.325\n         # \u8ba1\u7b97\u97f3\u901f,\u8fd4\u56de\u5355\u4f4d\u662f \u7c73/\u79d2;\n         self.vS_m_s = self.__calcSoundSpeed()\n\n         # \u521d\u59cb\u5316\u7528\u6765\u8bb0\u5f55 echo\u9ad8\u7535\u5e73\u6301\u7eed\u65f6\u95f4\u7684\u6570\u7ec4;\n         # self.logTimeArray = array.array("Q",[0 for x in range(2)])\n         self.logTimeArray = [0, 0]\n         self.index = 0\n\n     def __logHandler(self, source):\n         """\n         0 -> \u8bb0\u5f55 \u53d81\n         1 -> \u8bb0\u5f55 \u53d82\n         """\n         thisComeInTime = utime.ticks_us()\n         if self.index > 1:\n             return\n         self.logTimeArray[self.index] = thisComeInTime\n         self.index += 1\n\n     def __calcSoundSpeed(self):\n         e = 2.71828182845904523536\n         Kelvin = 273.15\n         T = self.temperature\n         P = self.pressure * 1000.0\n         Rh = self.relative_humidity\n         T_kel = Kelvin + T\n         ENH = 3.141593 * math.pow(10,-8)*P + 1.00062 + math.sqrt(T)*5.6*math.pow(10,-7)\n         PSV1 = math.sqrt(T_kel)*1.2378847*math.pow(10,-5)-1.9121316*math.pow(10,-2)*T_kel\n         PSV2 = 33.93711047-6.3431645*math.pow(10,3)/T_kel\n         PSV = math.pow(e,PSV1)*math.pow(e,PSV2)\n         H = Rh*ENH*PSV/P\n         Xw = H/100.0\n         Xc = 400.0*math.pow(10,-6)\n\n         C1 = 0.603055*T + 331.5024 - math.sqrt(T)*5.28*math.pow(10,-4) + (0.1495874*T + 51.471935 -math.sqrt(T)*7.82*math.pow(10,-4))*Xw\n         C2 = (-1.82*math.pow(10,-7)+3.73*math.pow(10,-8)*T-math.sqrt(T)*2.93*math.pow(10,-10))*P+(-85.20931-0.228525*T+math.sqrt(T)*5.91*math.pow(10,-5))*Xc\n         C3 = math.sqrt(Xw)*2.835149 - math.sqrt(P)*2.15*math.pow(10,-13) + math.sqrt(Xc)*29.179762 + 4.86*math.pow(10,-4)*Xw*P*Xc\n         C = C1 + C2 - C3\n         return C\n\n     def get_distance(self):\n         # \u7ed9trig \u6301\u7eed10us\u7684\u9ad8\u7535\u5e73,\u89e6\u53d1\u8ba9\u5b83\u53d1\u9001\u58f0\u6ce2;\n         self.trig.value(1)\n         utime.sleep_us(10)\n         self.trig.value(0)\n\n         # index\u5f520\u51c6\u5907\u89e6\u53d1__logHandler()\u51fd\u6570\u540e\u8bb0\u5f55t1,t2;\n         self.index = 0\n\n         # \u7b49\u7ea7\u8bb0\u5f55\u5b8c\u6bd5 t1\u548ct2;\n         while self.index < 2:\n             utime.sleep_ms(100)\n\n         vS_cm_us = (self.vS_m_s * 100) / 1000000\n         vS_mm_us = (self.vS_m_s * 1000) / 1000000\n         # t2 - t1 = echo\u7684\u9ad8\u7535\u5e73\u6301\u7eed\u65f6\u95f4,\u5355\u4f4d\u5fae\u79d2;\n         time_diff = self.logTimeArray[1] - self.logTimeArray[0]\n         print("[t1, t2]: ",self.logTimeArray)\n         print("time_diff: ", time_diff)\n         distance_cm = (time_diff * vS_cm_us) / 2\n         distance_mm = (time_diff * vS_mm_us) / 2\n         print("cm: ", distance_cm, "mm: ", distance_mm)\n         return distance_cm\nsoundDistance = Sound_distance(' + b + "," + a + ")";
            return ["soundDistance.get_distance()", Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.ad_infrared_sensor = function(a) {
            a = Blockly.Python.valueToCode(a, "PIN_NUM", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.ad_infrared_sensor = "\nfrom machine import Pin\nimport machine\n\n## \u8981\u63a5\u7535\u963b\npin_num = " + a + "\ninterrupt_counter = 0\ntotal_interrupts_counter = 0\n\ndef callback(pin):\n    global interrupt_counter\n    interrupt_counter = interrupt_counter + 1\n\np25 = Pin(pin_num, Pin.IN, Pin.PULL_UP)\np25.irq(trigger = Pin.IRQ_RISING, handler = callback)\n";
            return '\nwhile True:\n    if interrupt_counter > 0:\n        state = machine.disable_irq()\n        interrupt_counter = interrupt_counter - 1\n        machine.enable_irq(state)\n        total_interrupts_counter = total_interrupts_counter + 1\n        print("Interrupt has occurred: " + str(total_interrupts_counter))\n'
        }
        ;
        Blockly.Python.controls_repeat_forever = function(a) {
            return "while True :\n" + Blockly.Python.statementToCode(a, "DO")
        }
        ;
        Blockly.Python.main_controller_wifi_connect_internet = function(a) {
            var b = Blockly.Python.valueToCode(a, "ssid", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "password", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.main_controller_wifi_connect_internet = "import network\n_WIFI = network.WLAN(network.STA_IF)\n_WIFI.active(True)\n_WIFI.connect(" + b + ", " + a + ")\n";
            return ""
        }
        ;
        Blockly.Python.main_controller_get_wifi_connection_status = function(a) {
            return ["_WIFI.isconnected()", Blockly.Python.ORDER_CONDITIONAL]
        }
        ;
        Blockly.Python.led_matrix_setup = function(a) {
            var b = a.getFieldValue("brightness");
            a = a.getFieldValue("io");
            Blockly.Python.definitions_.led_matrix_setup = "import machine, neopixel, time\n_6x6_led_matrix = neopixel.NeoPixel(machine.Pin(" + a + "), 36)\n_iot_brightness = " + b + "\n\ndef rgba_to_rgb_conversion(red, green, blue):\n    if _iot_brightness <= 255:\n        alpha = _iot_brightness / 255\n    elif _iot_brightness > 255:\n        alpha = 255 / 255\n    elif _iot_brightness < 0:\n        alpha = 0 / 255\n    final_red = int((1 - alpha) * 0 + alpha * red)\n    final_green = int((1 - alpha) * 0 + alpha * green)\n    final_blue = int((1 - alpha) * 0 + alpha * blue)\n    final = (final_red, final_green, final_blue)\n    return final\n\n";
            return ""
        }
        ;
        Blockly.Python.led_matrix_colour_picker = function(a) {
            a = a.getFieldValue("COLOUR");
            var b = 0
              , d = 0
              , e = 0;
            try {
                7 == a.length && (b = parseInt(a.substring(1, 3), 16),
                d = parseInt(a.substring(3, 5), 16),
                e = parseInt(a.substring(5, 7), 16))
            } catch (f) {}
            return [b + "," + d + "," + e, Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.led_matrix_xy = function(a) {
            var b = Blockly.Python.valueToCode(a, "x", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "y", Blockly.Python.ORDER_ATOMIC);
            return [b + "," + a, Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.led_matrix_wh = function(a) {
            var b = Blockly.Python.valueToCode(a, "w", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "h", Blockly.Python.ORDER_ATOMIC);
            return [b + "," + a, Blockly.Python.ORDER_NONE]
        }
        ;
        Blockly.Python.led_matrix_draw_rectangle = function(a) {
            var b = Blockly.Python.valueToCode(a, "colour", Blockly.Python.ORDER_ATOMIC)
              , d = Blockly.Python.valueToCode(a, "coordinate", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "size", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.led_matrix_draw_rectangle_setup = "def _iot_led_draw_rectangle(x, y, w, h, rgb):\n    for i in range(x, x+ w, 1):\n        for j in range(y, y+h, 1):\n            _6x6_led_matrix[(((j*6)//6)-1)*6+(i-1)] = (rgb)\n";
            return "iot_rectangle_value_coordinate = " + d + "\niot_rectangle_value_size = " + a + "\n_iot_led_draw_rectangle(iot_rectangle_value_coordinate[0], iot_rectangle_value_coordinate[1], iot_rectangle_value_size[0], iot_rectangle_value_size[1], rgba_to_rgb_conversion" + b + ")\n"
        }
        ;
        Blockly.Python.led_matrix_show_above = function(a) {
            return "_6x6_led_matrix.write()\n"
        }
        ;
        Blockly.Python.network_http_get = function(a) {
            a = Blockly.Python.valueToCode(a, "http_get_url", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.import_urequests = "import urequests as requests\nimport ujson as json\n\n_SEND_HTTP_GET_ENDPOINT = " + a + "\n";
            return "_SEND_HTTP_REQUEST = requests.get(_SEND_HTTP_GET_ENDPOINT)\n"
        }
        ;
        Blockly.Python.network_http_post = function(a) {
            var b = Blockly.Python.valueToCode(a, "http_post_url", Blockly.Python.ORDER_ATOMIC);
            a = Blockly.Python.valueToCode(a, "data", Blockly.Python.ORDER_ATOMIC);
            Blockly.Python.definitions_.import_urequests = "import urequests as requests\nimport ujson as json\n\n_SEND_HTTP_POST_ENDPOINT = " + b + "\n";
            return "_SEND_HTTP_POST_DATA = ujson.dumps(" + a + ')\n_SEND_HTTP_REQUEST = requests.post(_SEND_HTTP_POST_ENDPOINT, data = _SEND_HTTP_POST_DATA , headers = { "Content-type": "application/json" })\n'
        }
        ;
        Blockly.Python.web_get_data = function(a) {
            a = a.getFieldValue("op");
            var b = "_SEND_HTTP_REQUEST.text";
            "text" == a ? b = "_SEND_HTTP_REQUEST.text" : "content" == a ? b = "_SEND_HTTP_REQUEST.content" : "state" == a ? b = "_SEND_HTTP_REQUEST.status_code" : "json" == a ? b = "_SEND_HTTP_REQUEST.json()" : "code" == a ? b = "_SEND_HTTP_REQUEST.encoding" : "reason" == a && (b = "_SEND_HTTP_REQUEST.reason");
            return [b, Blockly.Python.ORDER_CONDITIONAL]
        }
        ;
        Blockly.Python.dict_get = function(a) {
            var b = Blockly.Python.valueToCode(a, "DICT", Blockly.Python.ORDER_MEMBER) || "{}";
            a = Blockly.Python.valueToCode(a, "ITEM", Blockly.Python.ORDER_NONE) || "None";
            return [b + "[" + a + "]", Blockly.Python.ORDER_ATOMIC]
        }
        ;
        Blockly.Python.dicts_create_empty = function(a) {
            return ["{}", Blockly.Python.ORDER_ATOMIC]
        }
        ;
        return Blockly.defineBlocksWithJsonArray([{
            type: "dicts_create_empty",
            message0: "\u521b\u5efa\u7a7a\u5b57\u5178",
            output: "",
            colour: "260",
            tooltip: "",
            helpUrl: ""
        }, {
            type: "web_get_data",
            message0: "\u83b7\u53d6HTTP\u54cd\u5e94\u5185\u5bb9\u7684%1",
            args0: [{
                type: "field_dropdown",
                name: "op",
                options: [["text", "text"], ["content", "content"], ["state", "state"], ["json", "json"], ["code", "code"], ["reason", "reason"]]
            }],
            output: null,
            helpUrl: "",
            colour: "#183895",
            tooltip: ""
        }, {
            type: "network_http_get",
            message0: "\u53d1\u9001HTTP GET\u8bf7\u6c42",
            message1: "\u8bbe\u7f6e\u76ee\u6807\u7f51\u5740:%1",
            args1: [{
                type: "input_value",
                name: "http_get_url"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: "#183895",
            tooltip: "Returns number of letters in the provided text.",
            helpUrl: ""
        }, {
            type: "network_http_post",
            message0: "\u53d1\u9001HTTP post\u8bf7\u6c42",
            message1: "\u8bbe\u7f6e\u76ee\u6807\u7f51\u5740:%1",
            args1: [{
                type: "input_value",
                name: "http_post_url"
            }],
            message2: "\u63d0\u4ea4\u6570\u636e(JSON):%1",
            args2: [{
                type: "input_value",
                name: "data"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: "#183895",
            tooltip: "Returns number of letters in the provided text.",
            helpUrl: ""
        }, {
            type: "led_matrix_show_above",
            message0: "LED\u706f\u5c4f\u6a21\u5757\u663e\u793a\u751f\u6548",
            colour: "#e8795b",
            inputsInline: !0,
            previousStatement: null,
            nextStatement: null,
            tooltip: "",
            helpUrl: ""
        }, {
            type: "led_matrix_wh",
            message0: "\u5bbd:%1 \u9ad8:%2",
            args0: [{
                type: "input_value",
                name: "w",
                check: "Number"
            }, {
                type: "input_value",
                name: "h",
                check: "Number"
            }],
            inputsInline: !0,
            output: "Number",
            colour: "#e8795b",
            tooltip: "",
            helpUrl: ""
        }, {
            type: "led_matrix_xy",
            message0: "\u5217:%1 \u884c:%2",
            args0: [{
                type: "input_value",
                name: "x",
                check: "Number"
            }, {
                type: "input_value",
                name: "y",
                check: "Number"
            }],
            inputsInline: !0,
            output: "Number",
            colour: "#e8795b",
            tooltip: "",
            helpUrl: ""
        }, {
            type: "led_matrix_colour_picker",
            message0: "\u989c\u8272 %1",
            args0: [{
                type: "field_colour",
                name: "COLOUR",
                colour: "#ff0000"
            }],
            output: "Colour",
            helpUrl: "",
            colour: "#e8795b",
            tooltip: "",
            extensions: ["parent_tooltip_when_inline"]
        }, {
            type: "led_matrix_draw_rectangle",
            message0: "LED\u706f\u5c4f\u6a21\u5757 ",
            message1: "\u7ed8\u5236\u77e9\u5f62",
            message2: "\u989c\u8272: %1",
            message3: "\u5750\u6807: %1",
            message4: "\u5c3a\u5bf8: %1",
            args2: [{
                type: "input_value",
                name: "colour"
            }],
            args3: [{
                type: "input_value",
                name: "coordinate"
            }],
            args4: [{
                type: "input_value",
                name: "size"
            }],
            colour: "#e8795b",
            previousStatement: null,
            nextStatement: null,
            tooltip: "Returns number of letters in the provided text.",
            helpUrl: "http://www.w3schools.com/jsref/jsref_length_string.asp"
        }, {
            type: "led_matrix_setup",
            message0: "LED\u706f\u5c4f\u6a21\u5757(6x6)\u521d\u59cb\u5316\u8bbe\u7f6e ",
            message1: "\u8bbe\u7f6e\u706f\u5c4f\u5f15\u811a %1",
            message2: "\u8bbe\u7f6e\u706f\u5c4f\u4eae\u5ea6\u4e3a\uff1a%1 (\u4eae\u5ea6\u8303\u56f4\uff1a0~255)",
            args1: [{
                type: "field_dropdown",
                name: "io",
                options: [["25", "25"], ["15", "15"]]
            }],
            args2: [{
                type: "field_number",
                name: "brightness",
                value: 50
            }],
            colour: "#e8795b",
            previousStatement: null,
            nextStatement: null,
            tooltip: "Returns number of letters in the provided text.",
            helpUrl: "http://www.w3schools.com/jsref/jsref_length_string.asp"
        }, {
            type: "controls_ifelse",
            message0: "\u5982\u679c %1",
            args0: [{
                type: "input_value",
                name: "IF0",
                check: "Boolean"
            }],
            message1: "\u6267\u884c %1",
            args1: [{
                type: "input_statement",
                name: "DO0"
            }],
            message2: "\u5426\u5219\u6267\u884c %1",
            args2: [{
                type: "input_statement",
                name: "ELSE"
            }],
            previousStatement: null,
            nextStatement: null,
            tooltip: "",
            helpUrl: "",
            style: "logic_blocks",
            suppressPrefixSuffix: !0,
            extensions: ["controls_if_tooltip"]
        }, {
            type: "controls_repeat_forever",
            message0: "\u4e00\u76f4\u5faa\u73af",
            message1: "\u6267\u884c %1",
            args1: [{
                type: "input_statement",
                name: "DO"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: "",
            helpUrl: ""
        }, {
            type: "servos",
            message0: "\u8235\u673a ",
            message1: "pin_num(0-15)\uff1a%1",
            message2: "\u8bbe\u7f6e\u8235\u673a\u89d2\u5ea6\uff1a%1",
            args1: [{
                type: "input_value",
                name: "PIN_NUM",
                check: "Number"
            }],
            args2: [{
                type: "input_value",
                name: "DEGREES",
                check: "Number"
            }],
            colour: 160,
            previousStatement: null,
            nextStatement: null,
            tooltip: "Returns number of letters in the provided text.",
            helpUrl: "http://www.w3schools.com/jsref/jsref_length_string.asp"
        }, {
            type: "esp32_support",
            message0: "ESP32\u652f\u6301",
            colour: 300,
            tooltip: "",
            helpUrl: "ESP32\u652f\u6301"
        }, {
            type: "esp32_led",
            message0: "\u5b9a\u4e49LED\u706f %1",
            args0: [{
                type: "input_value",
                name: "PIN_NUMBER"
            }],
            inputsInline: !0,
            output: null,
            colour: 330,
            tooltip: "ESP32 LED",
            helpUrl: ""
        }, {
            type: "turn_on_off_led",
            message0: "\u70b9\u4eae/\u70b9\u706dLED %1 %2 %3",
            args0: [{
                type: "input_dummy"
            }, {
                type: "field_variable",
                name: "led_variable",
                variable: "item"
            }, {
                type: "input_value",
                name: "turn_on_led"
            }],
            previousStatement: null,
            colour: 230,
            tooltip: "\u70b9\u4eaeLED",
            helpUrl: ""
        }, {
            type: "ad_turn_on_off_led",
            message0: "\u70b9\u4eae/\u7184\u706dLED ",
            message1: "pin_num: %1",
            message2: "\u70b9\u4eae/\u7184\u706d(1/0): %1",
            args1: [{
                type: "input_value",
                name: "PIN_NUM",
                check: "Number"
            }],
            args2: [{
                type: "input_value",
                name: "STATE",
                check: "Number"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: 230,
            tooltip: "\u70b9\u4eaeLED",
            helpUrl: ""
        }, {
            type: "ad_thermal_humidity_sensor",
            message0: "\u6e29\u6e7f\u5ea6\u4f20\u611f\u5668\u7a0b\u5e8f ",
            message1: "led_pin_num: %1",
            message2: "dht_pin_num: %1",
            args1: [{
                type: "input_value",
                name: "LED_PIN_NUM",
                check: "Number"
            }],
            args2: [{
                type: "input_value",
                name: "DHT_PIN_NUM",
                check: "Number"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: 85,
            tooltip: "",
            output: "tuple",
            helpUrl: ""
        }, {
            type: "ad_ultra_sound_sensor",
            message0: "\u8d85\u58f0\u6ce2\u4f20\u611f\u5668\u7a0b\u5e8f ",
            message1: "trig_pin_num: %1",
            message2: "echo_pin_num: %1",
            args1: [{
                type: "input_value",
                name: "TRIG_PIN_NUM",
                check: "Number"
            }],
            args2: [{
                type: "input_value",
                name: "ECHO_PIN_NUM",
                check: "Number"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: 295,
            output: "Number",
            tooltip: "",
            helpUrl: ""
        }, {
            type: "ad_infrared_sensor",
            message0: "\u7ea2\u5916\u4f20\u611f\u5668\u4f8b\u7a0b ",
            message1: "pin_num: %1",
            args1: [{
                type: "input_value",
                name: "PIN_NUM",
                check: "Number"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: 211,
            tooltip: "",
            helpUrl: ""
        }, {
            type: "main_controller_wifi_connect_internet",
            message0: "\u8fde\u63a5WIFI\u7f51\u7edc ",
            message1: "SSID: %1",
            message2: "\u5bc6\u7801: %1",
            args1: [{
                type: "input_value",
                name: "ssid",
                check: "String"
            }],
            args2: [{
                type: "input_value",
                name: "password",
                check: "String"
            }],
            previousStatement: null,
            nextStatement: null,
            colour: "#386dc8",
            tooltip: "",
            helpUrl: ""
        }, {
            type: "main_controller_get_wifi_connection_status",
            message0: "\u83b7\u53d6WIFI\u8fde\u63a5\u72b6\u6001 ",
            colour: "#386dc8",
            tooltip: "",
            output: "Boolean",
            helpUrl: ""
        }, {
            type: "ultra_sound_sensor",
            message0: "\u8d85\u58f0\u6ce2\u4f20\u611f\u5668\u4f8b\u7a0b",
            colour: 295,
            tooltip: "\u8d85\u58f0\u6ce2\u4f20\u611f\u5668\u4f8b\u7a0b",
            helpUrl: ""
        }, {
            type: "infrared_sensor",
            message0: "\u7ea2\u5916\u4f20\u611f\u5668\u4f8b\u7a0b",
            colour: 211,
            tooltip: "\u7ea2\u5916\u4f20\u611f\u5668\u4f8b\u7a0b",
            helpUrl: ""
        }])
    };
    return {
        blocklyInit: function() {
            q();
            p();
            m();
            l();
            g();
            c()
        },
        getXmlToolbox: function() {
            let a = '<xml id="toolbox" style="display: none">\n';
            const b = blocklyCate.CATEGORY_MAP;
            for (key in b)
                a += b[key] + "\n";
            return a + "</xml>"
        },
        defaultToolboxJson: {
            contents: [{
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="controls_if"></block>',
                    type: "controls_if"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_ifelse"></block>',
                    type: "controls_ifelse"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_compare"></block>',
                    type: "logic_compare"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_operation"></block>',
                    type: "logic_operation"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_negate"></block>',
                    type: "logic_negate"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_boolean"></block>',
                    type: "logic_boolean"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_null"></block>',
                    type: "logic_null"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="logic_ternary"></block>',
                    type: "logic_ternary"
                }],
                id: "catLogic",
                colour: "210",
                name: "\u903b\u8f91"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="controls_repeat_ext">\n          <value name="TIMES">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "controls_repeat_ext"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_repeat_forever"></block>',
                    type: "controls_repeat_forever"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_whileUntil"></block>',
                    type: "controls_whileUntil"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_for">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n          <value name="BY">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "controls_for"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_forEach"></block>',
                    type: "controls_forEach"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="controls_flow_statements"></block>',
                    type: "controls_flow_statements"
                }],
                id: "catLoops",
                colour: "120",
                name: "\u5faa\u73af"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="math_number"></block>',
                    type: "math_number"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_arithmetic">\n          <value name="A">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="B">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_arithmetic"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_single">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">9</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_single"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_trig">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">45</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_trig"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_constant"></block>',
                    type: "math_constant"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_number_property">\n          <value name="NUMBER_TO_CHECK">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_number_property"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_change">\n          <value name="DELTA">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_change"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_round">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">3.1</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_round"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_on_list"></block>',
                    type: "math_on_list"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_modulo">\n          <value name="DIVIDEND">\n            <shadow type="math_number">\n              <field name="NUM">64</field>\n            </shadow>\n          </value>\n          <value name="DIVISOR">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_modulo"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_constrain">\n          <value name="VALUE">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="LOW">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="HIGH">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_constrain"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_random_int">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "math_random_int"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="math_random_float"></block>',
                    type: "math_random_float"
                }],
                id: "catMath",
                colour: "230",
                name: "\u7b97\u672f"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="text"></block>',
                    type: "text"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_join"></block>',
                    type: "text_join"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_append">\n          <value name="TEXT">\n            <shadow type="text"></shadow>\n          </value>\n        </block>',
                    type: "text_append"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_length">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_length"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_isEmpty">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT"></field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_isEmpty"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_indexOf">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n          <value name="FIND">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_indexOf"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_charAt">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
                    type: "text_charAt"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_getSubstring">\n          <value name="STRING">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
                    type: "text_getSubstring"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_changeCase">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_changeCase"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_trim">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_trim"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_print">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_print"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="text_prompt_ext">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "text_prompt_ext"
                }],
                id: "catText",
                colour: "160",
                name: "\u6587\u672c"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="lists_create_with">\n                 <mutation items="0"></mutation>\n               </block>',
                    type: "lists_create_with"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_create_with"></block>',
                    type: "lists_create_with"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_repeat"><value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>',
                    type: "lists_repeat"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_length"></block>',
                    type: "lists_length"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_isEmpty"></block>',
                    type: "lists_isEmpty"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">list</field></block></value></block>',
                    type: "lists_indexOf"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_getIndex">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
                    type: "lists_getIndex"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_setIndex">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
                    type: "lists_setIndex"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_getSublist">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
                    type: "lists_getSublist"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_split">\n          <value name="DELIM">\n            <shadow type="text">\n              <field name="TEXT">,</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "lists_split"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="lists_sort"></block>',
                    type: "lists_sort"
                }],
                id: "catLists",
                colour: "260",
                name: "\u5217\u8868"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="dicts_create_empty"> </block>',
                    type: "dicts_create_empty"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="dict_get"> <value name="DICT"><block type="variables_get"> <field name="VAR">dict</field></block></value></block>',
                    type: "dict_get"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="add_dict_key_value">      <value name="dict_name"><block type="variables_get"> <field name="VAR">dict</field></block></value>      <value name="dict_items"><shadow type="text"><field name="TEXT">Age</field></shadow></value>      <value name="add_value"><shadow type="math_number"><field name="NUM">10</field></shadow></value>  </block>',
                    type: "add_dict_key_value"
                }],
                id: "catDicts",
                colour: "260",
                name: "\u5b57\u5178"
            }, {
                kind: "CATEGORY",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="colour_picker"></block>',
                    type: "colour_picker"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="colour_random"></block>',
                    type: "colour_random"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="colour_rgb">\n          <value name="RED">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n          <value name="GREEN">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="BLUE">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "colour_rgb"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="colour_blend">\n          <value name="COLOUR1">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#ff0000</field>\n            </shadow>\n          </value>\n          <value name="COLOUR2">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#3333ff</field>\n            </shadow>\n          </value>\n          <value name="RATIO">\n            <shadow type="math_number">\n              <field name="NUM">0.5</field>\n            </shadow>\n          </value>\n        </block>',
                    type: "colour_blend"
                }],
                id: "catColour",
                colour: "20",
                name: "\u989c\u8272"
            }, {
                kind: "SEP"
            }, {
                kind: "CATEGORY",
                id: "catVariables",
                colour: "330",
                custom: "VARIABLE",
                name: "\u53d8\u91cf"
            }, {
                kind: "CATEGORY",
                id: "catFunctions",
                colour: "290",
                custom: "PROCEDURE",
                name: "\u51fd\u6570"
            }, {
                kind: "SEP"
            }, {
                kind: "CATEGORY",
                id: "catBasicHardware",
                colour: "290",
                name: "\u57fa\u7840\u786c\u4ef6\u7f16\u7a0b",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="delay_ms">\n          <value name="time">\n            <shadow type="math_number">\n             <field name="NUM">1000</field>\n           </shadow>\n          </value>\n    </block>',
                    name: "\u5ef6\u65f6",
                    type: "delay_ms"
                }, {
                    kind: "BLOCK",
                    id: "catEnableESP32",
                    name: "ESP32\u652f\u6301",
                    type: "esp32_support"
                }, {
                    kind: "BLOCK",
                    id: "catDefineLED",
                    name: "LED",
                    type: "esp32_led"
                }, {
                    kind: "BLOCK",
                    id: "catTurnOnOffLED",
                    name: "\u70b9\u4eae/\u5173\u4e0a LED",
                    type: "turn_on_off_led"
                }]
            }, {
                kind: "CATEGORY",
                id: "catAdvanceHardware",
                colour: "290",
                name: "\u9ad8\u7ea7\u786c\u4ef6\u7f16\u7a0b",
                contents: [{
                    kind: "BLOCK",
                    id: "catAdvanceTurnOnLED",
                    blockxml: '<block type="ad_turn_on_off_led">\n          <value name="PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n     <value name="STATE">\n            <shadow type="math_number">\n             <field name="NUM">0</field>\n           </shadow>\n          </value>\n   </block>',
                    name: "\u70b9\u4eae LED",
                    type: "ad_turn_on_off_led"
                }, {
                    kind: "BLOCK",
                    id: "ad_thermalHumiditySensor",
                    blockxml: '<block type="ad_thermal_humidity_sensor">\n          <value name="DHT_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n     <value name="LED_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">32</field>\n           </shadow>\n          </value>\n   </block>',
                    name: "\u6e29\u5ea6\u9002\u5ea6\u4f20\u611f\u5668\u7f16\u7a0b",
                    type: "ad_thermal_humidity_sensor"
                }, {
                    kind: "BLOCK",
                    id: "ad_blkUltraSoundSensor",
                    blockxml: '<block type="ad_ultra_sound_sensor">\n          <value name="TRIG_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n     <value name="ECHO_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">13</field>\n           </shadow>\n          </value>\n   </block>',
                    name: "\u8d85\u58f0\u6ce2\u4f20\u611f\u5668\u7f16\u7a0b",
                    type: "ad_ultra_sound_sensor"
                }, {
                    kind: "BLOCK",
                    id: "ad_blkInfraredSensor",
                    blockxml: '<block type="ad_infrared_sensor">\n          <value name="PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">25</field>\n           </shadow>\n          </value>\n        </block>',
                    name: "\u7ea2\u5916\u4f20\u611f\u5668\u7f16\u7a0b",
                    type: "ad_infrared_sensor"
                }]
            }, {
                kind: "CATEGORY",
                id: "catMainWifi",
                colour: "#386dc8",
                name: "WIFI\u6a21\u5757",
                contents: [{
                    kind: "BLOCK",
                    id: "catWifiConnect",
                    blockxml: '<block type="main_controller_wifi_connect_internet">\n          <value name="ssid">\n            <shadow type="text">\n             <field name="TEXT">ENTER_YOUR_SSID</field>\n           </shadow>\n          </value>\n     <value name="password">\n            <shadow type="text">\n             <field name="TEXT">ENTER_YOUR_PASSWORD</field>\n           </shadow>\n          </value>\n   </block>',
                    name: "WIFI\u8fde\u63a5",
                    type: "main_controller_wifi_connect_internet"
                }, {
                    kind: "BLOCK",
                    id: "catGetWifiConnect",
                    blockxml: '<block type="main_controller_get_wifi_connection_status"></block>',
                    name: "\u83b7\u53d6WIFI\u94fe\u63a5\u72b6\u6001",
                    type: "main_controller_get_wifi_connection_status"
                }]
            }, {
                kind: "CATEGORY",
                id: "catWeb",
                colour: "#183895",
                name: "\u4e92\u8054\u7f51\u6a21\u5757",
                contents: [{
                    kind: "BLOCK",
                    id: "catNetworkHttpGet",
                    blockxml: '<block type="network_http_get">\n          <value name="http_get_url">\n            <shadow type="text">\n             <field name="TEXT">HTTP://ENTER_AN_URL</field>\n           </shadow>\n          </value>\n     </block>',
                    name: "http_get \u8bf7\u6c42",
                    type: "network_http_get"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="network_http_post">\n          <value name="http_post_url">\n            <shadow type="text">\n             <field name="TEXT">HTTP://ENTER_AN_URL</field>\n           </shadow>\n          </value>\n  <value name="data"></value>   </block>',
                    name: "http_post \u8bf7\u6c42",
                    type: "network_http_post"
                }, {
                    kind: "BLOCK",
                    id: "catGetHttpData",
                    blockxml: '<block type="web_get_data"></block>',
                    name: "\u83b7\u53d6http\u6570\u636e",
                    type: "web_get_data"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_init"> <value name="clientid">\n            <shadow type="text">\n             <field name="TEXT">mqtt_client_id</field>\n           </shadow>\n          </value>\n <value name="server">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n <value name="port">\n            <shadow type="math_number">\n             <field name="NUM">1883</field>\n           </shadow>\n          </value>\n  </block>',
                    name: "Mqtt\u521d\u59cb\u5316",
                    type: "mqtt_init"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_set_callback"> </block>',
                    name: "\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570",
                    type: "mqtt_set_callback"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_connect"> </block>',
                    name: "Mqtt\u8fde\u63a5",
                    type: "mqtt_connect"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_check_msg"> </block>',
                    name: "Mqtt\u8fde\u63a5",
                    type: "mqtt_check_msg"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_subscribe"> <value name="topic">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n </block>',
                    name: "Mqtt \u8ba2\u9605topic",
                    type: "mqtt_subscribe"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="mqtt_publish_payload"> <value name="topic">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n  <value name="payload">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n</block>',
                    name: "Mqtt \u53d1\u9001\u6570\u636e",
                    type: "mqtt_publish_payload"
                }]
            }, {
                kind: "CATEGORY",
                id: "catMainLEDS",
                colour: "#e8795b",
                name: "LED\u706f\u5c4f\u6a21\u5757",
                contents: [{
                    kind: "BLOCK",
                    id: "catledmatrixshow",
                    blockxml: '<block type="led_matrix_show_above"></block>',
                    name: "LED\u706f\u5c4f\u663e\u793a",
                    type: "led_matrix_show_above"
                }, {
                    kind: "BLOCK",
                    id: "catledsetup",
                    blockxml: '<block type="led_matrix_setup"> </block>',
                    name: "LED\u706f\u5c4f\u521d\u59cb\u5316",
                    type: "led_matrix_setup"
                }, {
                    kind: "BLOCK",
                    id: "catledcolorpicker",
                    blockxml: '<block type="led_matrix_colour_picker">\n <value name="rgb_value_r">\n    <shadow type="math_number">\n   <field name="NUM">0</field>\n   </shadow>\n  </value>\n <value name="rgb_value_g">\n <shadow type="math_number">\n <field name="NUM">0</field>\n </shadow>\n </value>\n  <value name="rgb_value_b">\n <shadow type="math_number">\n <field name="NUM">0</field>\n  </shadow>\n </value>\n </block>',
                    name: "LED\u989c\u8272\u9009\u62e9",
                    type: "led_matrix_colour_picker"
                }, {
                    kind: "BLOCK",
                    id: "catledmatrixxy",
                    blockxml: '<block type="led_matrix_xy">\n <value name="x">\n    <shadow type="math_number">\n   <field name="NUM">1</field>\n   </shadow>\n  </value>\n <value name="y">\n <shadow type="math_number">\n <field name="NUM">1</field>\n </shadow>\n </value>\n </block>',
                    name: "LED\u706f\u5c4f\u5750\u6807",
                    type: "led_matrix_xy"
                }, {
                    kind: "BLOCK",
                    id: "catledmatrixwh",
                    blockxml: '<block type="led_matrix_wh">\n <value name="w">\n    <shadow type="math_number">\n   <field name="NUM">1</field>\n   </shadow>\n  </value>\n <value name="h">\n <shadow type="math_number">\n <field name="NUM">1</field>\n </shadow>\n </value>\n </block>',
                    name: "LED\u706f\u5c4f\u5bbd\u9ad8",
                    type: "led_matrix_wh"
                }, {
                    kind: "BLOCK",
                    id: "catleddrawrectangle",
                    blockxml: '<block type="led_matrix_draw_rectangle">          <value name="colour">            <block type="led_matrix_colour_picker">            </block>          </value>      <value name="coordinate">        <block type="led_matrix_xy">          <value name="x">            <block type="math_number">              <field name="NUM">1</field>            </block>          </value>          <value name="y">            <block type="math_number">              <field name="NUM">1</field>            </block>          </value>        </block>      </value>      <value name="size">        <block type="led_matrix_wh">          <value name="w">            <block type="math_number">              <field name="NUM">6</field>            </block>          </value>          <value name="h">            <block type="math_number">              <field name="NUM">6</field>            </block>          </value>        </block>      </value></block>',
                    name: "LED\u7ed8\u5236\u77e9\u5f62",
                    type: "led_matrix_draw_rectangle"
                }]
            }, {
                kind: "CATEGORY",
                id: "catServo",
                colour: "105",
                name: "\u8235\u673a/\u7535\u673a\u7f16\u7a0b",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="stepper_init">\n          <value name="p0">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n   <value name="p1">\n            <shadow type="math_number">\n             <field name="NUM">3</field>\n           </shadow>\n          </value>\n   <value name="p2">\n            <shadow type="math_number">\n             <field name="NUM">2</field>\n           </shadow>\n          </value>\n   <value name="p3">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n    </block>',
                    type: "stepper_init"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="stepper_step">\n  <value name="steps">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n   </block>',
                    type: "stepper_step"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="init_servo">\n          <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n    </block>',
                    type: "init_servo"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="move_servo">\n          <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n   <value name="angle">\n            <shadow type="math_number">\n             <field name="NUM">90</field>\n           </shadow>\n          </value>\n  </block>',
                    type: "move_servo"
                }]
            }, {
                kind: "CATEGORY",
                id: "catSensors",
                colour: "85",
                name: "\u4f20\u611f\u5668\u7f16\u7a0b",
                contents: [{
                    kind: "BLOCK",
                    blockxml: '<block type="dht_init">\n  <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n </block>',
                    type: "dht_init"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="dht_measure">\n </block>',
                    type: "dht_measure"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="dht_read_temp">\n </block>',
                    type: "dht_read_temp"
                }, {
                    kind: "BLOCK",
                    blockxml: '<block type="dht_read_humidity">\n </block>',
                    type: "dht_read_humidity"
                }, {
                    kind: "BLOCK",
                    id: "blkUltraSoundSensor",
                    name: "\u8d85\u58f0\u6ce2\u4f20\u611f\u5668\u4f8b\u7a0b",
                    type: "ultra_sound_sensor"
                }, {
                    kind: "BLOCK",
                    id: "blkInfraredSensor",
                    name: "\u7ea2\u5916\u7ebf\u4f20\u611f\u5668\u4f8b\u7a0b",
                    type: "infrared_sensor"
                }]
            }],
            id: "toolbox",
            style: "display: none"
        }
    }
}();
