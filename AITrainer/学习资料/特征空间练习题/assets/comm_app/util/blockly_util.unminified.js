var process = process || {env: {NODE_ENV: "development"}};
const blockly = {}

class CustomCategory extends Blockly.ToolboxCategory {
  /**
   * Constructor for a custom category.
   * @override
   */
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  /**
   * Adds the colour to the toolbox.
   * This is called on category creation and whenever the theme changes.
   * @override
   */
  addColourBorder_(colour) {
    this.rowDiv_.style.backgroundColor = colour;
  }

  /**
   * Sets the style for the category when it is selected or deselected.
   * @param {boolean} isSelected True if the category has been selected,
   *     false otherwise.
   * @override
   */
  setSelected(isSelected) {
    // We do not store the label span on the category, so use getElementsByClassName.
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
    if (isSelected) {
      // Change the background color of the div to white.
      this.rowDiv_.style.backgroundColor = 'white';
      // Set the colour of the text to the colour of the category.
      labelDom.style.color = this.colour_;
      this.iconDom_.style.color = this.colour_;
    } else {
      // Set the background back to the original colour.
      this.rowDiv_.style.backgroundColor = this.colour_;
      // Set the text back to white.
      labelDom.style.color = 'white';
      this.iconDom_.style.color = 'white';
    }
    // This is used for accessibility purposes.
    Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
        Blockly.utils.aria.State.SELECTED, isSelected);
  }

  /**
   * Creates the dom used for the icon.
   * @return {HTMLElement} The element for the icon.
   * @override
   */
  createIconDom_() {
    const iconImg = document.createElement('img');
    iconImg.src = './logo_only.svg';
    iconImg.alt = 'Blockly Logo';
    iconImg.width = '25';
    iconImg.height = '25';
    return iconImg;
  }
}

blockly.util = function () {
  const toolboxJson = {
    contents: [
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_if"></block>',
            type: 'controls_if',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_ifelse"></block>',
            type: 'controls_ifelse',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_compare"></block>',
            type: 'logic_compare',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_operation"></block>',
            type: 'logic_operation',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_negate"></block>',
            type: 'logic_negate',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_boolean"></block>',
            type: 'logic_boolean',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_null"></block>',
            type: 'logic_null',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_ternary"></block>',
            type: 'logic_ternary',
          },
        ],
        id: 'catLogic',
        colour: '210',
        name: '逻辑',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="controls_repeat_ext">\n          <value name="TIMES">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'controls_repeat_ext',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="controls_repeat_forever"></block>',
            type: 'controls_repeat_forever',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_whileUntil"></block>',
            type: 'controls_whileUntil',
          },

          {
            kind: 'BLOCK',
            blockxml:
                '<block type="controls_for">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n          <value name="BY">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'controls_for',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_forEach"></block>',
            type: 'controls_forEach',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_flow_statements"></block>',
            type: 'controls_flow_statements',
          },
        ],
        id: 'catLoops',
        colour: '120',
        name: '循环',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_number"></block>',
            type: 'math_number',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_arithmetic">\n          <value name="A">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="B">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_arithmetic',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_single">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">9</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_single',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_trig">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">45</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_trig',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_constant"></block>',
            type: 'math_constant',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_number_property">\n          <value name="NUMBER_TO_CHECK">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_number_property',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_change">\n          <value name="DELTA">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_change',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_round">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">3.1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_round',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_on_list"></block>',
            type: 'math_on_list',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_modulo">\n          <value name="DIVIDEND">\n            <shadow type="math_number">\n              <field name="NUM">64</field>\n            </shadow>\n          </value>\n          <value name="DIVISOR">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_modulo',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_constrain">\n          <value name="VALUE">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="LOW">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="HIGH">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_constrain',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="math_random_int">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_random_int',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_random_float"></block>',
            type: 'math_random_float',
          },
        ],
        id: 'catMath',
        colour: '230',
        name: '算术',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="text"></block>',
            type: 'text',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="text_join"></block>',
            type: 'text_join',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_append">\n          <value name="TEXT">\n            <shadow type="text"></shadow>\n          </value>\n        </block>',
            type: 'text_append',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_length">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_length',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_isEmpty">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT"></field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_isEmpty',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_indexOf">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n          <value name="FIND">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_indexOf',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_charAt">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
            type: 'text_charAt',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_getSubstring">\n          <value name="STRING">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
            type: 'text_getSubstring',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_changeCase">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_changeCase',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_trim">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_trim',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_print">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_print',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="text_prompt_ext">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_prompt_ext',
          },
        ],
        id: 'catText',
        colour: '160',
        name: '文本',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                `<block type="lists_create_with">
                 <mutation items="0"></mutation>
               </block>`,
            type: 'lists_create_with',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_create_with"></block>',
            type: 'lists_create_with',
          },
          {
            kind: 'BLOCK',
            blockxml:
                `<block type="lists_repeat"><value name="NUM"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block>`,
            type: 'lists_repeat',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_length"></block>',
            type: 'lists_length',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_isEmpty"></block>',
            type: 'lists_isEmpty',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="lists_indexOf"><value name="VALUE"><block type="variables_get"><field name="VAR">list</field></block></value></block>',
            type: 'lists_indexOf',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="lists_getIndex">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_getIndex',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="lists_setIndex">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_setIndex',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="lists_getSublist">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_getSublist',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="lists_split">\n          <value name="DELIM">\n            <shadow type="text">\n              <field name="TEXT">,</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'lists_split',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_sort"></block>',
            type: 'lists_sort',
          },
        ],
        id: 'catLists',
        colour: '260',
        name: '列表',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dicts_create_empty"> </block>',
            type: 'dicts_create_empty',
          },

          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dict_get"> <value name="DICT"><block type="variables_get"> <field name="VAR">dict</field></block></value></block>',
            type: 'dict_get',
          }, 
          {

            kind: 'BLOCK',
            blockxml:
                '<block type="add_dict_key_value">' +
                '      <value name="dict_name"><block type="variables_get"> <field name="VAR">dict</field></block></value>' +
                '      <value name="dict_items"><shadow type="text"><field name="TEXT">Age</field></shadow></value>' +
                '      <value name="add_value"><shadow type="math_number"><field name="NUM">10</field></shadow></value>' +
                '  </block>' ,
            type: 'add_dict_key_value',
          },

        ],
        id: 'catDicts',
        colour: '260',
        name: '字典',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="colour_picker"></block>',
            type: 'colour_picker',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="colour_random"></block>',
            type: 'colour_random',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="colour_rgb">\n          <value name="RED">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n          <value name="GREEN">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="BLUE">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'colour_rgb',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="colour_blend">\n          <value name="COLOUR1">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#ff0000</field>\n            </shadow>\n          </value>\n          <value name="COLOUR2">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#3333ff</field>\n            </shadow>\n          </value>\n          <value name="RATIO">\n            <shadow type="math_number">\n              <field name="NUM">0.5</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'colour_blend',
          },
        ],
        id: 'catColour',
        colour: '20',
        name: '颜色',
      },
      {
        kind: 'SEP',
      },
      {
        kind: 'CATEGORY',
        id: 'catVariables',
        colour: '330',
        custom: 'VARIABLE',
        name: '变量',
      },
      {
        kind: 'CATEGORY',
        id: 'catFunctions',
        colour: '290',
        custom: 'PROCEDURE',
        name: '函数',
      },
      {
        kind: 'SEP',
      },
      {
        kind: 'CATEGORY',
        id: 'catBasicHardware',
        colour: '290',
        name: '基础硬件编程',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="delay_ms">\n          <value name="time">\n            <shadow type="math_number">\n             <field name="NUM">1000</field>\n           </shadow>\n          </value>\n    </block>',
            name: '延时',
            type: 'delay_ms',
          },
          {
            kind: 'BLOCK',
            id: 'catEnableESP32',
            name: 'ESP32支持',
            type: 'esp32_support',
          },
          {
            kind: 'BLOCK',
            id: 'catDefineLED',
            name: 'LED',
            type: 'esp32_led',
          },
          {
            kind: 'BLOCK',
            id: 'catTurnOnOffLED',
            name: '点亮/关上 LED',
            type: 'turn_on_off_led',
          }
        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catAdvanceHardware',
        colour: '290',
        name: '高级硬件编程',
        contents: [
          {
            kind: 'BLOCK',
            id: 'catAdvanceTurnOnLED',
            blockxml:
                '<block type="ad_turn_on_off_led">\n          <value name="PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n     <value name="STATE">\n            <shadow type="math_number">\n             <field name="NUM">0</field>\n           </shadow>\n          </value>\n   </block>',

            name: '点亮 LED',
            type: 'ad_turn_on_off_led',
          },
          {
            kind: 'BLOCK',
            id: 'ad_thermalHumiditySensor',
            blockxml:
                '<block type="ad_thermal_humidity_sensor">\n          <value name="DHT_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n     <value name="LED_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">32</field>\n           </shadow>\n          </value>\n   </block>',

            name: '温度适度传感器编程',
            type: 'ad_thermal_humidity_sensor',
          },
          {
            kind: 'BLOCK',
            id: 'ad_blkUltraSoundSensor',
            blockxml:
                '<block type="ad_ultra_sound_sensor">\n          <value name="TRIG_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n     <value name="ECHO_PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">13</field>\n           </shadow>\n          </value>\n   </block>',

            name: '超声波传感器编程',
            type: 'ad_ultra_sound_sensor',
          },
          {
            kind: 'BLOCK',
            id: 'ad_blkInfraredSensor',
            blockxml:
                '<block type="ad_infrared_sensor">\n          <value name="PIN_NUM">\n            <shadow type="math_number">\n             <field name="NUM">25</field>\n           </shadow>\n          </value>\n        </block>',

            name: '红外传感器编程',
            type: 'ad_infrared_sensor',
          }
        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catMainWifi',
        colour: '#386dc8',
        name: 'WIFI模块',
        contents: [
          {
            kind: 'BLOCK',
            id: 'catWifiConnect',
            blockxml:
                '<block type="main_controller_wifi_connect_internet">\n          <value name="ssid">\n            <shadow type="text">\n             <field name="TEXT">ENTER_YOUR_SSID</field>\n           </shadow>\n          </value>\n     <value name="password">\n            <shadow type="text">\n             <field name="TEXT">ENTER_YOUR_PASSWORD</field>\n           </shadow>\n          </value>\n   </block>',

            name: 'WIFI连接',
            type: 'main_controller_wifi_connect_internet',
          },
          {
            kind: 'BLOCK',
            id: 'catGetWifiConnect',
            blockxml:
                '<block type="main_controller_get_wifi_connection_status"></block>',

            name: '获取WIFI链接状态',
            type: 'main_controller_get_wifi_connection_status',
          }
        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catWeb',
        colour: '#183895',
        name: '互联网模块',
        contents: [
          {
            kind: 'BLOCK',
            id: 'catNetworkHttpGet',
            blockxml:
                '<block type="network_http_get">\n          <value name="http_get_url">\n            <shadow type="text">\n             <field name="TEXT">HTTP://ENTER_AN_URL</field>\n           </shadow>\n          </value>\n     </block>',

            name: 'http_get 请求',
            type: 'network_http_get',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="network_http_post">\n          <value name="http_post_url">\n            <shadow type="text">\n             <field name="TEXT">HTTP://ENTER_AN_URL</field>\n           </shadow>\n          </value>\n  <value name="data"></value>   </block>',

            name: 'http_post 请求',
            type: 'network_http_post',
          },
          {
            kind: 'BLOCK',
            id: 'catGetHttpData',
            blockxml:
                '<block type="web_get_data"></block>',

            name: '获取http数据',
            type: 'web_get_data',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_init"> <value name="clientid">\n            <shadow type="text">\n             <field name="TEXT">mqtt_client_id</field>\n           </shadow>\n          </value>\n <value name="server">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n <value name="port">\n            <shadow type="math_number">\n             <field name="NUM">1883</field>\n           </shadow>\n          </value>\n  </block>',

            name: 'Mqtt初始化',
            type: 'mqtt_init',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_set_callback"> </block>',

            name: '设置回调函数',
            type: 'mqtt_set_callback',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_connect"> </block>',

            name: 'Mqtt连接',
            type: 'mqtt_connect',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_check_msg"> </block>',

            name: 'Mqtt连接',
            type: 'mqtt_check_msg',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_subscribe"> <value name="topic">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n </block>',

            name: 'Mqtt 订阅topic',
            type: 'mqtt_subscribe',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="mqtt_publish_payload"> <value name="topic">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n  <value name="payload">\n            <shadow type="text">\n             <field name="TEXT"></field>\n           </shadow>\n          </value>\n</block>',

            name: 'Mqtt 发送数据',
            type: 'mqtt_publish_payload',
          }
        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catMainLEDS',
        colour: '#e8795b',
        name: 'LED灯屏模块',
        contents: [
          {
            kind: 'BLOCK',
            id: 'catledmatrixshow',
            blockxml:
                '<block type="led_matrix_show_above"></block>',
            name: 'LED灯屏显示',
            type: 'led_matrix_show_above',
          },
          {
            kind: 'BLOCK',
            id: 'catledsetup',
            blockxml:
                '<block type="led_matrix_setup"> </block>',

            name: 'LED灯屏初始化',
            type: 'led_matrix_setup',
          },
          {
            kind: 'BLOCK',
            id: 'catledcolorpicker',
            blockxml:
                '<block type="led_matrix_colour_picker">\n <value name="rgb_value_r">\n    <shadow type="math_number">\n   <field name="NUM">0</field>\n   </shadow>\n  </value>\n <value name="rgb_value_g">\n <shadow type="math_number">\n <field name="NUM">0</field>\n </shadow>\n </value>\n  <value name="rgb_value_b">\n <shadow type="math_number">\n <field name="NUM">0</field>\n  </shadow>\n </value>\n </block>',

            name: 'LED颜色选择',
            type: 'led_matrix_colour_picker',
          },
          {
            kind: 'BLOCK',
            id: 'catledmatrixxy',
            blockxml:
                '<block type="led_matrix_xy">\n <value name="x">\n    <shadow type="math_number">\n   <field name="NUM">1</field>\n   </shadow>\n  </value>\n <value name="y">\n <shadow type="math_number">\n <field name="NUM">1</field>\n </shadow>\n </value>\n </block>',

            name: 'LED灯屏坐标',
            type: 'led_matrix_xy',
          },
          {
            kind: 'BLOCK',
            id: 'catledmatrixwh',
            blockxml:
                '<block type="led_matrix_wh">\n <value name="w">\n    <shadow type="math_number">\n   <field name="NUM">1</field>\n   </shadow>\n  </value>\n <value name="h">\n <shadow type="math_number">\n <field name="NUM">1</field>\n </shadow>\n </value>\n </block>',

            name: 'LED灯屏宽高',
            type: 'led_matrix_wh',
          },
          {
            kind: 'BLOCK',
            id: 'catleddrawrectangle',
            blockxml:
                '<block type="led_matrix_draw_rectangle">' +
                '          <value name="colour">' +
                '            <block type="led_matrix_colour_picker">' +
                '            </block>' +
                '          </value>' +
                '      <value name="coordinate">' +
                '        <block type="led_matrix_xy">' +
                '          <value name="x">' +
                '            <block type="math_number">' +
                '              <field name="NUM">1</field>' +
                '            </block>' +
                '          </value>' +
                '          <value name="y">' +
                '            <block type="math_number">' +
                '              <field name="NUM">1</field>' +
                '            </block>' +
                '          </value>' +
                '        </block>' +
                '      </value>' +
                '      <value name="size">' +
                '        <block type="led_matrix_wh">' +
                '          <value name="w">' +
                '            <block type="math_number">' +
                '              <field name="NUM">6</field>' +
                '            </block>' +
                '          </value>' +
                '          <value name="h">' +
                '            <block type="math_number">' +
                '              <field name="NUM">6</field>' +
                '            </block>' +
                '          </value>' +
                '        </block>' +
                '      </value>' +
                '</block>',
            name: 'LED绘制矩形',
            type: 'led_matrix_draw_rectangle',
          },

        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catServo',
        colour: '105',
        name: '舵机/电机编程',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="stepper_init">\n          <value name="p0">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n   <value name="p1">\n            <shadow type="math_number">\n             <field name="NUM">3</field>\n           </shadow>\n          </value>\n   <value name="p2">\n            <shadow type="math_number">\n             <field name="NUM">2</field>\n           </shadow>\n          </value>\n   <value name="p3">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n    </block>',
            type: 'stepper_init',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="stepper_step">\n  <value name="steps">\n            <shadow type="math_number">\n             <field name="NUM">1</field>\n           </shadow>\n          </value>\n   </block>',
            type: 'stepper_step',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="init_servo">\n          <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n    </block>',
            type: 'init_servo',
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="move_servo">\n          <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">12</field>\n           </shadow>\n          </value>\n   <value name="angle">\n            <shadow type="math_number">\n             <field name="NUM">90</field>\n           </shadow>\n          </value>\n  </block>',
            type: 'move_servo',
          }
        ]
      },
      {
        kind: 'CATEGORY',
        id: 'catSensors',
        colour: '85',
        name: '传感器编程',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dht_init">\n  <value name="pin">\n            <shadow type="math_number">\n             <field name="NUM">4</field>\n           </shadow>\n          </value>\n </block>',
            type: 'dht_init'
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dht_measure">\n </block>',
            type: 'dht_measure'
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dht_read_temp">\n </block>',
            type: 'dht_read_temp'
          },
          {
            kind: 'BLOCK',
            blockxml:
                '<block type="dht_read_humidity">\n </block>',
            type: 'dht_read_humidity'
          },
          {
            kind: 'BLOCK',
            id: 'blkUltraSoundSensor',
            name: '超声波传感器例程',
            type: 'ultra_sound_sensor'
          },
          {
            kind: 'BLOCK',
            id: 'blkInfraredSensor',
            name: '红外线传感器例程',
            type: 'infrared_sensor'
          }
        ]
      }
    ],
    id: 'toolbox',
    style: 'display: none',
  };





  const blocklyInit = function () {
    addLedBlock()
    addMqttBlock()
    addTimeBlock()
    addDictBlock()
    addDhtBlock()
    addStepperServoBlock()
  }
  const addStepperServoBlock = function (){
    Blockly.Blocks['stepper_init'] = {
      init: function() {
        this.setColour(95);
        this.appendDummyInput()
            .appendField("初始化步进电机");
        this.appendValueInput("p0")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin0#");
        this.appendValueInput("p1")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin1#");
        this.appendValueInput("p2")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin2#");
        this.appendValueInput("p3")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin3#");
        this.setPreviousStatement(!0);
        this.setNextStatement(!0);
        this.setTooltip("")
      }
    };

    Blockly.Blocks['stepper_step'] = {
      init: function() {
        this.setColour(95);
        this.appendDummyInput()
            .appendField("Stepper step");
        this.appendValueInput("steps")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("steps");
        this.setPreviousStatement(!0);
        this.setNextStatement(!0);
        this.setTooltip("")
      }
    };

    Blockly.Blocks['init_servo'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("初始化舵机");
        this.appendValueInput("pin")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin#");
        this.setColour(85);
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setTooltip("Init RC servo motor");
        this.setHelpUrl("http://www.bipes.net.ebr")
      }
    };
    Blockly.Blocks['move_servo'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("转动舵机角度");
        this.appendValueInput("pin")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("pin#");
        this.appendValueInput("angle")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("angle");
        this.setColour(85);
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setTooltip("Move RC servo motor to degrees");
        this.setHelpUrl("http://www.bipes.net.ebr")
      }
    };

    /////////////////////////////python code ///////////////////////////////////////////////////////////////
    Blockly.Python['stepper_init'] = function(a) {
      var b = Blockly.Python.valueToCode(a, "p0", Blockly.Python.ORDER_NONE),
          c = Blockly.Python.valueToCode(a, "p1", Blockly.Python.ORDER_NONE),
          d = Blockly.Python.valueToCode(a, "p2", Blockly.Python.ORDER_NONE);
      a = Blockly.Python.valueToCode(a, "p3", Blockly.Python.ORDER_NONE);
      Blockly.Python.definitions_.import_machine = "import machine";
      Blockly.Python.definitions_.import_time = "import utime";
      return "\npins = [\n    machine.Pin(" + b + ", machine.Pin.OUT),  # 1\n    machine.Pin(" + c + ", machine.Pin.OUT),  # 2\n    machine.Pin(" +
          d + ", machine.Pin.OUT),  # 4\n    machine.Pin(" + a + ", machine.Pin.OUT),  # 8\n]\n\nphases = [ 1, 5, 4, 6, 2, 10, 8, 9 ]\n"
    };
    Blockly.Python['stepper_step'] = function(a) {
      return "\nfor i in range(1, " + Blockly.Python.valueToCode(a, "steps", Blockly.Python.ORDER_ATOMIC) + "):\n    for phase in phases:\n        for n, p in enumerate(pins):\n            pins[n](phase & 1 < < n)\n        time.sleep(0.001)\n"
    };

    Blockly.Python['init_servo'] = function(a) {
      a = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
      Blockly.Python.definitions_.import_machine = "import machine";
      return "pservo" + a + " = machine.Pin(" + a + ")\nservo" + (a + " = machine.PWM(pservo" + a + ",freq=50)\n")
    };
    Blockly.Python['move_servo'] = function(a) {
      var b = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
      a = Blockly.Python.valueToCode(a, "angle", Blockly.Python.ORDER_ATOMIC);
      return "servo" + b + ".duty(" + a + ")\n"
    };
  }
  const addDhtBlock = function (){
    Blockly.Blocks['dht_init'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("初始化 DHT 传感器");

        this.appendDummyInput()
            .appendField("Type")
            .appendField(new Blockly.FieldDropdown([
              ["DHT11", "DHT11"],
              ["DHT22", "DHT22"]
            ]), "DHT_TYPE");
        this.appendValueInput("pin")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldLabelSerializable("pin#"), "DHT_PIN_MSG");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0,
            null);
        this.setColour(15);
        this.setTooltip("Init DHT11 ou DHT22 sensor");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    Blockly.Blocks['dht_measure'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("测试 DHT11/22 传感器"), "MSG_MEASURE_DHT");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(15);
        this.setTooltip("Measure DHT11/22 Sensor");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };
    Blockly.Blocks['dht_read_temp'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("读取 DHT11/22 温度"), "MSG_READ_DHT_TEMP");
        this.setOutput(!0, null);
        this.setColour(15);
        this.setTooltip("Read DHT11/22 Temperature");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };
    Blockly.Blocks['dht_read_humidity'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable("读取 DHT11/22 湿度"), "MSG_READ_DHT_HUMI");
        this.setOutput(!0, null);
        this.setColour(15);
        this.setTooltip("Read DHT11/22 Humidity");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    ///////////////////////////////// dth python code ///////////////////////////////////////////////
    Blockly.Python['dht_init'] = function(a) {
      var b = Blockly.Python.valueToCode(a, "pin", Blockly.Python.ORDER_NONE);
      a = a.getFieldValue("DHT_TYPE");
      Blockly.Python.definitions_.import_pin = "from machine import Pin";
      Blockly.Python.definitions_.import_dht = "import dht";
      return "dhts = dht." + a + "(Pin(" + b + "))\n"
    };

    Blockly.Python['dht_measure'] = function(a) {
      return "dhts.measure()\n"
    };
    Blockly.Python['dht_read_temp'] = function(a) {
      return ["dhts.temperature()", Blockly.Python.ORDER_NONE]
    };
    Blockly.Python['dht_read_humidity'] = function(a) {
      return ["dhts.humidity()", Blockly.Python.ORDER_NONE]
    };
  }

  const addDictBlock = function (){
    Blockly.Blocks['dicts_create_with_item'] = {
      // Add items.
      init: function() {
        this.setColour(260);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("");
        this.contextMenu = false;
      }
    };
    Blockly.Blocks['dict_get'] = {
      // Set element at index.
      init: function() {
        this.setColour(260);
        this.appendValueInput('DICT').appendField(
            "在字典中")
        this.appendValueInput('ITEM')
            .appendField("获取key的值");
        this.setInputsInline(true);
        this.setOutput(true);
        //this.setPreviousStatement(true);
        //this.setNextStatement(true);
      }
    };
    Blockly.Blocks['add_dict_key_value'] = {
      init: function () {
        this.jsonInit({
          colour: '260',
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
          helpUrl: '',
          tooltip: '',
          message0: '字典%1 添加键%2 值%3'
        })
      }
    };
    //////////////python code//////////////////////////////////////////////
    Blockly.Python.add_dict_key_value = function(a) {
      var b = Blockly.Python.valueToCode(a, "dict_name", Blockly.Python.ORDER_ATOMIC),
          c = Blockly.Python.valueToCode(a, "dict_items", Blockly.Python.ORDER_ATOMIC);
      a = Blockly.Python.valueToCode(a, "add_value", Blockly.Python.ORDER_ATOMIC);
      return b + "[" + c + "] \x3d " + a + "\n"
    };
  }
  const addTimeBlock = function(){
    Blockly.Blocks['delay_ms'] = {
      init: function() {
        this.appendValueInput("time").setCheck("Number").appendField("延时 ms");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(140);
        this.setTooltip("Delay processing in milliseconds");
        this.setHelpUrl("http://www.bipes.net.br/")
      }
    };
    //////////////////////python code/////////////////////////////////////

    Blockly.Python['delay_ms'] = function(a) {
      a = Blockly.Python.valueToCode(a, "time", Blockly.Python.ORDER_ATOMIC);
      Blockly.Python.definitions_.import_time = "import utime";
      return "utime.sleep_ms(" + a + ")\n"
    };
  }
  const addMqttBlock = function (){
    Blockly.Blocks['mqtt_init'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("初始化 MQTT client"), "BLOCK_MQTT_INIT");
        this.appendValueInput("clientid").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("client ID"), "MQTT_CLIENT_ID");
        this.appendValueInput("server").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("server address"), "MQTT_SERVER");
        this.appendValueInput("port").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("server port"),
            "MQTT_PORT");
        this.appendValueInput("user").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("username"), "MQTT_USER");
        this.appendValueInput("password").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("password"), "MQTT_PASSWORD");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(280);
        this.setTooltip("Init MQTT Client");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    Blockly.Blocks['mqtt_subscribe'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("订阅 MQTT topic"), "BLOCK_MQTT_SUBSCRIBE");
        this.appendValueInput("topic").setCheck("String").setAlign(Blockly.ALIGN_RIGHT).appendField(new Blockly.FieldLabelSerializable("topic"), "MQTT_TOPIC");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(280);
        this.setTooltip("Subscribe to MQTT Topic");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    Blockly.Blocks['mqtt_connect'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("连接 MQTT 客户端"), "BLOCK_MQTT_CONNECT");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(280);
        this.setTooltip("Connect the MQTT Client from Server.");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    Blockly.Blocks['mqtt_set_callback'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("设置回调函数接收 MQTT 消息"), "BLOCK_MQTT_SET_CALLBACK");
        this.appendDummyInput().appendField("接收").appendField(new Blockly.FieldVariable("callback_msg"), "MQTT_DATA_VAR").appendField("来自于").appendField(new Blockly.FieldVariable("callback_topic", null, ["String"], "String"), "MQTT_TOPIC_VAR");
        this.appendStatementInput("do").appendField("do");
        this.setPreviousStatement(!0,
            null);
        this.setNextStatement(!0, null);
        this.setColour(280);
        this.setInputsInline(!1);
        this.setTooltip("Callback function must have topic and msg parameters");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };
    Blockly.Blocks['mqtt_check_msg'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("检查MQTT消息"), "BLOCK_MQTT_CHECK_MSG");
        this.setPreviousStatement(!0, null);
        this.setNextStatement(!0, null);
        this.setColour(280);
        this.setTooltip("Check if the server has any pending messages. Non-blocking method. Subscription messages will be passed to the callback.");
        this.setHelpUrl("http://www.bipes.net.br")
      }
    };

    Blockly.Blocks['mqtt_publish_payload'] = {
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldLabelSerializable("发送数据到 MQTT topic"), "BLOCK_MQTT_PUBLISH");
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

    /////////////////////python code////////////////////////////////////////////////////
    Blockly.Python['mqtt_publish_payload'] = function(a) {
      var b = Blockly.Python.valueToCode(a, "topic", Blockly.Python.ORDER_ATOMIC),
          c = Blockly.Python.valueToCode(a, "payload", Blockly.Python.ORDER_ATOMIC);
      //a = a.getFieldValue("MQTT_QOS");
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      return "mqtt_client.publish(" + b + ", " + c + ")\n"
    };

    Blockly.Python['mqtt_check_msg'] = function(a) {
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      return "mqtt_client.check_msg()\n"
    };
    Blockly.Python['mqtt_init'] = function(a) {
      var b = Blockly.Python.valueToCode(a, "clientid", Blockly.Python.ORDER_ATOMIC),
          c = Blockly.Python.valueToCode(a, "server", Blockly.Python.ORDER_ATOMIC),
          d = Blockly.Python.valueToCode(a, "port", Blockly.Python.ORDER_ATOMIC),
          e = Blockly.Python.valueToCode(a, "user", Blockly.Python.ORDER_ATOMIC);
      a = Blockly.Python.valueToCode(a, "password", Blockly.Python.ORDER_ATOMIC);
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      return 0 == e.length && 0 == a.length ?
          "mqtt_client = MQTTClient(" + b + ", server=" + c + ", port=" + d + ")\n" : "mqtt_client = MQTTClient(" + b + ", server=" + c + ", port=" + d + ", user=" + e + ", password=" + a + ")\n"
    };

    Blockly.Python['mqtt_subscribe'] = function(a) {
      a = Blockly.Python.valueToCode(a, "topic", Blockly.Python.ORDER_ATOMIC);
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      return "mqtt_client.subscribe(" + a + ")\n"
    };
    Blockly.Python['mqtt_connect'] = function(a) {
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      return "mqtt_client.connect()\n"
    };
    Blockly.Python['mqtt_set_callback'] = function(a) {
      for (var b = Blockly.Python.variableDB_.getName(a.getFieldValue("MQTT_DATA_VAR"), Blockly.VARIABLE_CATEGORY_NAME), c = Blockly.Python.variableDB_.getName(a.getFieldValue("MQTT_TOPIC_VAR"), Blockly.VARIABLE_CATEGORY_NAME), d = [], e, f = a.workspace, h = Blockly.Variables.allUsedVarModels(f) || [], g = 0; e = h[g]; g++) e = e.name, -1 == a.getVars().indexOf(e) && e != b && e != c && d.push(Blockly.Python.variableDB_.getName(e, Blockly.VARIABLE_CATEGORY_NAME));
      f = Blockly.Variables.allDeveloperVariables(f);
      for (g = 0; g < f.length; g++) d.push(Blockly.Python.variableDB_.getName(f[g], Blockly.Names.DEVELOPER_VARIABLE_TYPE));
      d = d.length ? Blockly.Python.INDENT + "global " + d.join(", ") : "";
      Blockly.Python.definitions_["import_umqtt.simple"] = "from umqtt.simple import MQTTClient";
      Blockly.Python.definitions_["import_json"] = "import json"
      a = Blockly.Python.statementToCode(a, "do");
      return "mqtt_client.set_callback(" + Blockly.Python.provideFunction_("mqtt_callback", ["def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(" + c + "," + b + "):",  Blockly.Python.INDENT + b + '=json.loads('+b+')', a]) + ")\n"
    };
  }
  const getXmlToolbox = function () {
    let toolboxXml = '<xml id="toolbox" style="display: none">' + '\n'
    const cateMap = blocklyCate.CATEGORY_MAP
    for (key in cateMap) {
      toolboxXml += cateMap[key] + "\n"
    }

    toolboxXml = toolboxXml + '</xml>'
    return toolboxXml
  }

  const addLedBlock = function () {
    Blockly.Python['esp32_support'] = function (block) {
      const code = 'import machine';
      return code;
    };

    Blockly.Python['esp32_led'] = function (block) {
      const value_pin_number = Blockly.Python.valueToCode(block, 'PIN_NUMBER', Blockly.Python.ORDER_ATOMIC);

      const code =
          `import machine.Pin
` +

          'Pin(' + value_pin_number + ', Pin.OUT)';
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python['turn_on_off_led'] = function (block) {
      const variable_led_variable = Blockly.Python.nameDB_.getName(block.getFieldValue('led_variable'), Blockly.Variables.NAME_TYPE);
      const value_turn_on_led = Blockly.Python.valueToCode(block, 'turn_on_led', Blockly.Python.ORDER_ATOMIC);
      console.log(value_turn_on_led)
      let code = ''
      if (value_turn_on_led === 'True')
        code = variable_led_variable + '.off()\n';
      else
        code = variable_led_variable + ".on()\n";

      return code
    };

    Blockly.Python['dht_init'] = function (block) {

      return code;
    };

    Blockly.Python['ultra_sound_sensor'] = function (block) {
      const code = `
import machine
import utime
from time import sleep
import math


class Sound_distance(object):
    """
    1. 给trip口加一个>=10us的高电平信号让他工作;
    2. 他发射超声波遇到障碍物后返回;
    3. echo口会接收到高电平信号,持续时间与上面1,2步骤的时间成正比;
    """
    def __init__(self, trigPinNum=12, echoPinNum=13,
                temperature=20, relative_humidity=30,
                pressure=101.325):

        self.trig = machine.Pin(trigPinNum, machine.Pin.OUT)
        self.trig.value(0)

        """
        默认情况下echo.value()是0;
        当变成1时触发__logHandler()函数,记录变成1的时间t1,
        再当变成0时再次触发__logHandler()函数, 记录变成0时的时间t2,
        """
        self.echo = machine.Pin(echoPinNum, machine.Pin.IN)
        self.echo.irq(
            trigger=machine.Pin.IRQ_RISING | machine.Pin.IRQ_FALLING,
            handler=self.__logHandler)

        self.temperature = 20
        self.relative_humidity = 30
        self.pressure = 101.325
        # 计算音速,返回单位是 米/秒;
        self.vS_m_s = self.__calcSoundSpeed()

        # 初始化用来记录 echo高电平持续时间的数组;
        # self.logTimeArray = array.array("Q",[0 for x in range(2)])
        self.logTimeArray = [0, 0]
        self.index = 0

    def __logHandler(self, source):
        """        
        0 -> 记录 变1
        1 -> 记录 变2
        """
        thisComeInTime = utime.ticks_us()
        if self.index > 1:
            return
        self.logTimeArray[self.index] = thisComeInTime
        self.index += 1

    def __calcSoundSpeed(self):
        e = 2.71828182845904523536
        Kelvin = 273.15
        T = self.temperature
        P = self.pressure * 1000.0
        Rh = self.relative_humidity
        T_kel = Kelvin + T
        ENH = 3.141593 * math.pow(10,-8)*P + 1.00062 + math.sqrt(T)*5.6*math.pow(10,-7)
        PSV1 = math.sqrt(T_kel)*1.2378847*math.pow(10,-5)-1.9121316*math.pow(10,-2)*T_kel
        PSV2 = 33.93711047-6.3431645*math.pow(10,3)/T_kel
        PSV = math.pow(e,PSV1)*math.pow(e,PSV2)
        H = Rh*ENH*PSV/P
        Xw = H/100.0
        Xc = 400.0*math.pow(10,-6)

        C1 = 0.603055*T + 331.5024 - math.sqrt(T)*5.28*math.pow(10,-4) + (0.1495874*T + 51.471935 -math.sqrt(T)*7.82*math.pow(10,-4))*Xw
        C2 = (-1.82*math.pow(10,-7)+3.73*math.pow(10,-8)*T-math.sqrt(T)*2.93*math.pow(10,-10))*P+(-85.20931-0.228525*T+math.sqrt(T)*5.91*math.pow(10,-5))*Xc
        C3 = math.sqrt(Xw)*2.835149 - math.sqrt(P)*2.15*math.pow(10,-13) + math.sqrt(Xc)*29.179762 + 4.86*math.pow(10,-4)*Xw*P*Xc
        C = C1 + C2 - C3
        return C

    def get_distance(self):
        # 给trig 持续10us的高电平,触发让它发送声波;
        self.trig.value(1)
        utime.sleep_us(10)
        self.trig.value(0)

        # index归0准备触发__logHandler()函数后记录t1,t2;
        self.index = 0

        # 等级记录完毕 t1和t2;
        while self.index < 2:
            utime.sleep_ms(100)

        vS_cm_us = (self.vS_m_s * 100) / 1000000
        vS_mm_us = (self.vS_m_s * 1000) / 1000000
        # t2 - t1 = echo的高电平持续时间,单位微秒;
        time_diff = self.logTimeArray[1] - self.logTimeArray[0]
        print("[t1, t2]: ",self.logTimeArray)
        print("time_diff: ", time_diff)
        distance_cm = (time_diff * vS_cm_us) / 2
        distance_mm = (time_diff * vS_mm_us) / 2
        print("cm: ", distance_cm, "\\nmm: ", distance_mm)
        return [distance_cm, distance_mm]

soundDistance = Sound_distance()

while True:
    sleep(1)
    soundDistance.get_distance()
`
      return code
    }

    Blockly.Python['infrared_sensor'] = function (block) {
      const code = `
from machine import Pin
import machine

## 要接电阻
pin_num = 25
interrupt_counter = 0
total_interrupts_counter = 0

def callback(pin):
    global interrupt_counter
    interrupt_counter = interrupt_counter + 1
    
p25 = Pin(pin_num, Pin.IN, Pin.PULL_UP)
p25.irq(trigger = Pin.IRQ_RISING, handler = callback)

while True:
    if interrupt_counter > 0:
        state = machine.disable_irq()
        interrupt_counter = interrupt_counter - 1
        machine.enable_irq(state)
        total_interrupts_counter = total_interrupts_counter + 1
        print("Interrupt has occurred: " + str(total_interrupts_counter))
`
      return code
    }




    Blockly.Python["servos"] = function (block) {
      var value_pin_num = Blockly.Python.valueToCode(block,"PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var value_degrees = Blockly.Python.valueToCode(block,"DEGREES",Blockly.Python.ORDER_ATOMIC);

      var code = `
from machine import I2C, SoftI2C
from machine import Pin
import ustruct
import time
import math

class PCA9685:
    def __init__(self, i2c, address=0x40):
        self.i2c = i2c
        self.address = address
        self.reset()

    def _write(self, address, value):
        self.i2c.writeto_mem(self.address, address, bytearray([value]))

    def _read(self, address):
        return self.i2c.readfrom_mem(self.address, address, 1)[0]

    def reset(self):
        self._write(0x00, 0x00) # Mode1

    def freq(self, freq=None):

        if freq is None:
            return int(25000000.0 / 4096 / (self._read(0xfe) - 0.5))
        prescale = int(25000000.0 / 4096.0 / freq + 0.5)
        old_mode = self._read(0x00) # Mode 1
        self._write(0x00, (old_mode & 0x7F) | 0x10) # Mode 1, sleep
        self._write(0xfe, prescale) # Prescale
        self._write(0x00, old_mode) # Mode 1
        time.sleep_us(5)
        self._write(0x00, old_mode | 0xa1) # Mode 1, autoincrement on

    def pwm(self, index, on=None, off=None):
        if on is None or off is None:
            data = self.i2c.readfrom_mem(self.address, 0x06 + 4 * index, 4)
            return ustruct.unpack('<HH', data)
        data = ustruct.pack('<HH', on, off)
        self.i2c.writeto_mem(self.address, 0x06 + 4 * index,  data)

    def duty(self, index, value=None, invert=False):
        if value is None:
            pwm = self.pwm(index)
            if pwm == (0, 4096):
                value = 0
            elif pwm == (4096, 0):
                value = 4095
            value = pwm[1]
            if invert:
                value = 4095 - value
            return value
        if not 0 <= value <= 4095:
            raise ValueError("Out of range")
        if invert:
            value = 4095 - value
        if value == 0:
            self.pwm(index, 0, 4096)
        elif value == 4095:
            self.pwm(index, 4096, 0)
        else:
            self.pwm(index, 0, value)




class Servos:
    def __init__(self, i2c, address=0x40, freq=50, min_us=500, max_us=2500,  #根据舵机参数自行设置 0 - 180度
                 degrees=180):
        self.period = 1000000 / freq
        self.min_duty = self._us2duty(min_us)
        self.max_duty = self._us2duty(max_us)
        self.degrees = degrees
        self.freq = freq
        self.pca9685 = PCA9685(i2c, address)
        self.pca9685.freq(freq)

    def _us2duty(self, value):
        return int(4095 * value / self.period)

    def position(self, index, degrees=None, radians=None, us=None, duty=None):
        span = self.max_duty - self.min_duty
        if degrees is not None:
            duty = self.min_duty + span * degrees / self.degrees
        elif radians is not None:
            duty = self.min_duty + span * radians / math.radians(self.degrees)
        elif us is not None:
            duty = self._us2duty(us)
        elif duty is not None:
            pass
        else:
            return self.pca9685.duty(index)
        duty = min(self.max_duty, max(self.min_duty, int(duty)))
        self.pca9685.duty(index, duty)

    def release(self, index):
        self.pca9685.duty(index, 0)

    def position_duty(self, index, degrees=None, radians=None, us=None, duty=None):
        int_dutu=int(duty)
        self.pca9685.duty(index, int_dutu)

servos = Servos(SoftI2C(scl=Pin(23), sda=Pin(19), freq=100000), address=0x40) #舵机控制板(直插)

def angle(pin_num, degrees):            #设置舵机角度
    servos.position(pin_num, degrees)

`+
          'angle('+ value_pin_num + ',' + value_degrees + ')'


      return code;
    };

    Blockly.Python["ad_turn_on_off_led"] = function (block) {
      var value_pin_num = Blockly.Python.valueToCode(block,"PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var value_state = Blockly.Python.valueToCode(block,"STATE",Blockly.Python.ORDER_ATOMIC);
      var setup = `
import time
from machine import Pin

def led_light(state , pin):
  _led = Pin(pin,Pin.OUT)
  
  if (state == 1):
    _led.off()
  elif(state == 0):
    _led.on()
    
`
      Blockly.Python.definitions_['ad_turn_on_off_led'] = setup
      var code =

          'led_light('+ value_state + ',' + value_pin_num + ')\n'


      return code;
    };

    Blockly.Python["ad_thermal_humidity_sensor"] = function (block) {
      var led_pin_num = Blockly.Python.valueToCode(block,"LED_PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var dht_pin_num = Blockly.Python.valueToCode(block,"DHT_PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var setup = `
import time
from machine import Pin
import dht
import machine

# 需要在打开DHT11开关为ON
# 红灯为32引脚，默认为高电平，灭灯
`
          +
          "led_red = Pin(" + led_pin_num + ',' + "Pin.OUT, value=1)"
          +
          `
def read_dht11(dht_pin):
  
    dht11 = dht.DHT11(machine.Pin(dht_pin)) # 说明DHT11接在GPIO4引脚上"
    dht11.measure()
    #buff="温度:%02d 湿度:%02d" % (dht11.temperature(), dht11.humidity())
    temp_hum_tuple = (dht11.temperature(), dht11.humidity())
    return temp_hum_tuple
`
      Blockly.Python.definitions_['ad_thermal_humidity_sensor'] = setup
      var code =

          'read_dht11('+ dht_pin_num + ')'


      return [code, Blockly.Python.ORDER_NONE]
    };

    Blockly.Python["ad_ultra_sound_sensor"] = function (block) {
      var trig_pin_num = Blockly.Python.valueToCode(block,"TRIG_PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var echo_pin_num = Blockly.Python.valueToCode(block,"ECHO_PIN_NUM",Blockly.Python.ORDER_ATOMIC);
      var setup = `
import machine
import utime
from time import sleep
import math


class Sound_distance(object):
     """
     1. 给trip口加一个>=10us的高电平信号让他工作;
     2. 他发射超声波遇到障碍物后返回;
     3. echo口会接收到高电平信号,持续时间与上面1,2步骤的时间成正比;
     """
     def __init__(self, trig_pin_num, echo_pin_num,
                 temperature=20, relative_humidity=30,
                 pressure=101.325):

         self.trigPinNum = trig_pin_num
         self.echoPinNUm = echo_pin_num
         self.trig = machine.Pin(trigPinNum, machine.Pin.OUT)
         self.trig.value(0)

         """
         默认情况下echo.value()是0;
         当变成1时触发__logHandler()函数,记录变成1的时间t1,
         再当变成0时再次触发__logHandler()函数, 记录变成0时的时间t2,
         """
         self.echo = machine.Pin(echoPinNum, machine.Pin.IN)
         self.echo.irq(
             trigger=machine.Pin.IRQ_RISING | machine.Pin.IRQ_FALLING,
             handler=self.__logHandler)

         self.temperature = 20
         self.relative_humidity = 30
         self.pressure = 101.325
         # 计算音速,返回单位是 米/秒;
         self.vS_m_s = self.__calcSoundSpeed()

         # 初始化用来记录 echo高电平持续时间的数组;
         # self.logTimeArray = array.array("Q",[0 for x in range(2)])
         self.logTimeArray = [0, 0]
         self.index = 0

     def __logHandler(self, source):
         """
         0 -> 记录 变1
         1 -> 记录 变2
         """
         thisComeInTime = utime.ticks_us()
         if self.index > 1:
             return
         self.logTimeArray[self.index] = thisComeInTime
         self.index += 1

     def __calcSoundSpeed(self):
         e = 2.71828182845904523536
         Kelvin = 273.15
         T = self.temperature
         P = self.pressure * 1000.0
         Rh = self.relative_humidity
         T_kel = Kelvin + T
         ENH = 3.141593 * math.pow(10,-8)*P + 1.00062 + math.sqrt(T)*5.6*math.pow(10,-7)
         PSV1 = math.sqrt(T_kel)*1.2378847*math.pow(10,-5)-1.9121316*math.pow(10,-2)*T_kel
         PSV2 = 33.93711047-6.3431645*math.pow(10,3)/T_kel
         PSV = math.pow(e,PSV1)*math.pow(e,PSV2)
         H = Rh*ENH*PSV/P
         Xw = H/100.0
         Xc = 400.0*math.pow(10,-6)

         C1 = 0.603055*T + 331.5024 - math.sqrt(T)*5.28*math.pow(10,-4) + (0.1495874*T + 51.471935 -math.sqrt(T)*7.82*math.pow(10,-4))*Xw
         C2 = (-1.82*math.pow(10,-7)+3.73*math.pow(10,-8)*T-math.sqrt(T)*2.93*math.pow(10,-10))*P+(-85.20931-0.228525*T+math.sqrt(T)*5.91*math.pow(10,-5))*Xc
         C3 = math.sqrt(Xw)*2.835149 - math.sqrt(P)*2.15*math.pow(10,-13) + math.sqrt(Xc)*29.179762 + 4.86*math.pow(10,-4)*Xw*P*Xc
         C = C1 + C2 - C3
         return C

     def get_distance(self):
         # 给trig 持续10us的高电平,触发让它发送声波;
         self.trig.value(1)
         utime.sleep_us(10)
         self.trig.value(0)

         # index归0准备触发__logHandler()函数后记录t1,t2;
         self.index = 0

         # 等级记录完毕 t1和t2;
         while self.index < 2:
             utime.sleep_ms(100)

         vS_cm_us = (self.vS_m_s * 100) / 1000000
         vS_mm_us = (self.vS_m_s * 1000) / 1000000
         # t2 - t1 = echo的高电平持续时间,单位微秒;
         time_diff = self.logTimeArray[1] - self.logTimeArray[0]
         print("[t1, t2]: ",self.logTimeArray)
         print("time_diff: ", time_diff)
         distance_cm = (time_diff * vS_cm_us) / 2
         distance_mm = (time_diff * vS_mm_us) / 2
         print("cm: ", distance_cm, "mm: ", distance_mm)
         return distance_cm
` +
          'soundDistance = Sound_distance(' + trig_pin_num + ',' + echo_pin_num+ ')'
      Blockly.Python.definitions_['ad_ultra_sound_sensor'] = setup
      var code = 'soundDistance.get_distance()'


      return [code, Blockly.Python.ORDER_NONE]
    };


    Blockly.Python["ad_infrared_sensor"] = function (block) {
      var pin_num = Blockly.Python.valueToCode(block,"PIN_NUM",Blockly.Python.ORDER_ATOMIC);

      var setup = `
from machine import Pin
import machine

## 要接电阻
`
          +
          'pin_num = ' + pin_num
          +
          `
interrupt_counter = 0
total_interrupts_counter = 0

def callback(pin):
    global interrupt_counter
    interrupt_counter = interrupt_counter + 1

p25 = Pin(pin_num, Pin.IN, Pin.PULL_UP)
p25.irq(trigger = Pin.IRQ_RISING, handler = callback)
`
      Blockly.Python.definitions_['ad_infrared_sensor'] = setup
      var code =
          `
while True:
    if interrupt_counter > 0:
        state = machine.disable_irq()
        interrupt_counter = interrupt_counter - 1
        machine.enable_irq(state)
        total_interrupts_counter = total_interrupts_counter + 1
        print("Interrupt has occurred: " + str(total_interrupts_counter))
`

      return code;
    };

    Blockly.Python['controls_repeat_forever'] = function (block) {
      let branch = Blockly.Python.statementToCode(block, 'DO');

      return 'while True :' + "\n" + branch
    }


    Blockly.Python['main_controller_wifi_connect_internet'] = function (block) {
      var text_ssid = Blockly.Python.valueToCode(block, 'ssid', Blockly.Python.ORDER_ATOMIC);
      var text_password = Blockly.Python.valueToCode(block, 'password', Blockly.Python.ORDER_ATOMIC);


      Blockly.Python.definitions_['main_controller_wifi_connect_internet'] = '' +
          'import network\n' +
          '_WIFI = network.WLAN(network.STA_IF)\n' +
          '_WIFI.active(True)\n' +
          '_WIFI.connect(' + text_ssid + ', ' + text_password + ')\n'

      var code = '';
      return code;
    };

    Blockly.Python['main_controller_get_wifi_connection_status'] = function (block) {
      // TODO: Assemble Python into code variable.
      var code = '_WIFI.isconnected()';
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_CONDITIONAL];
    };

    Blockly.Python['led_matrix_setup'] = function (block) {

      var number_brightness = block.getFieldValue('brightness');
      var dropdown_io = block.getFieldValue('io');


      Blockly.Python.definitions_['led_matrix_setup'] = '' +
          'import machine, neopixel, time\n' +
          '_6x6_led_matrix = neopixel.NeoPixel(machine.Pin(' + dropdown_io + '), 36)\n' +
          '_iot_brightness = ' + number_brightness + '\n' +
          '\n' +
          'def rgba_to_rgb_conversion(red, green, blue):\n' +
          '    if _iot_brightness <= 255:\n' +
          '        alpha = _iot_brightness / 255\n' +
          '    elif _iot_brightness > 255:\n' +
          '        alpha = 255 / 255\n' +
          '    elif _iot_brightness < 0:\n' +
          '        alpha = 0 / 255\n' +
          '    final_red = int((1 - alpha) * 0 + alpha * red)\n' +
          '    final_green = int((1 - alpha) * 0 + alpha * green)\n' +
          '    final_blue = int((1 - alpha) * 0 + alpha * blue)\n' +
          '    final = (final_red, final_green, final_blue)\n' +
          '    return final\n' +
          '\n';
      // TODO: Assemble Python into code variable.
      var code = '';
      return code;
    };

    Blockly.Python['led_matrix_colour_picker'] = function (block) {
      var colour = block.getFieldValue('COLOUR');


      var d = 0,
          e = 0,
          f = 0;
      try {
        7 == colour.length && (d = parseInt(colour.substring(1, 3), 16),
            e = parseInt(colour.substring(3, 5), 16),
            f = parseInt(colour.substring(5, 7), 16))
      } catch (g) { }

      // TODO: Assemble Python into code variable.
      var code = d + ',' + e + ',' + f;
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python['led_matrix_xy'] = function (block) {
      var value_x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
      var value_y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
      // TODO: Assemble Python into code variable.

      var code = value_x + ',' + value_y;
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python['led_matrix_wh'] = function (block) {
      var value_w = Blockly.Python.valueToCode(block, 'w', Blockly.Python.ORDER_ATOMIC);
      var value_h = Blockly.Python.valueToCode(block, 'h', Blockly.Python.ORDER_ATOMIC);
      // TODO: Assemble Python into code variable.
      var code = value_w + ',' + value_h;
      // TODO: Change ORDER_NONE to the correct strength.
      return [code, Blockly.Python.ORDER_NONE];
    };

    Blockly.Python['led_matrix_draw_rectangle'] = function (block) {
      var value_color = Blockly.Python.valueToCode(block, 'colour', Blockly.Python.ORDER_ATOMIC);
      var value_coordinate = Blockly.Python.valueToCode(block, 'coordinate', Blockly.Python.ORDER_ATOMIC);
      var value_size = Blockly.Python.valueToCode(block, 'size', Blockly.Python.ORDER_ATOMIC);

      Blockly.Python.definitions_['led_matrix_draw_rectangle_setup'] = '' +
          'def _iot_led_draw_rectangle(x, y, w, h, rgb):\n' +
          '    for i in range(x, x+ w, 1):\n' +
          '        for j in range(y, y+h, 1):\n' +
          '            _6x6_led_matrix[(((j*6)//6)-1)*6+(i-1)] = (rgb)' +
          '\n';



      var code = 'iot_rectangle_value_coordinate = ' + value_coordinate + '\n' +
          'iot_rectangle_value_size = ' + value_size + '\n' +
          '_iot_led_draw_rectangle(iot_rectangle_value_coordinate[0], iot_rectangle_value_coordinate[1], iot_rectangle_value_size[0], iot_rectangle_value_size[1], rgba_to_rgb_conversion' + value_color + ')\n';
      return code;
    };

    Blockly.Python['led_matrix_show_above'] = function (block) {
      // TODO: Assemble Python into code variable.
      var code = '_6x6_led_matrix.write()\n';
      return code;
    };

    Blockly.Python['network_http_get'] = function (block) {
      var url = Blockly.Python.valueToCode(block, 'http_get_url', Blockly.Python.ORDER_ATOMIC);

      // Blockly.Python.addVariable('_SEND_HTTP_GET_ENDPOINT', '', true);
      // Blockly.Python.addVariable('_SEND_HTTP_REQUEST', '', true);

      Blockly.Python.definitions_['import_urequests'] = '' +
          'import urequests as requests\n' +
          'import ujson as json\n' +
          '\n' +
          '_SEND_HTTP_GET_ENDPOINT = ' + url + '\n' +
          '';
      // TODO: Assemble Python into code variable.

      var code = '_SEND_HTTP_REQUEST = requests.get(_SEND_HTTP_GET_ENDPOINT)\n';
      return code;
    };

    Blockly.Python['network_http_post'] = function (block) {
      var url = Blockly.Python.valueToCode(block, 'http_post_url', Blockly.Python.ORDER_ATOMIC);
      var data = Blockly.Python.valueToCode(block, 'data', Blockly.Python.ORDER_ATOMIC);

      //Blockly.Python.addVariable('_SEND_HTTP_POST_ENDPOINT', '', true);
      //Blockly.Python.addVariable('_SEND_HTTP_REQUEST', '', true);

      Blockly.Python.definitions_['import_urequests'] = '' +
          'import urequests as requests\n' +
          'import ujson as json\n' +
          '\n' +
          '_SEND_HTTP_POST_ENDPOINT = ' + url + '\n' +
          '';
      // TODO: Assemble Python into code variable.

      var code = '' +
          '_SEND_HTTP_POST_DATA = ' + 'ujson.dumps('+ data +')' + '\n' +
          '_SEND_HTTP_REQUEST = requests.post(_SEND_HTTP_POST_ENDPOINT, data = _SEND_HTTP_POST_DATA , headers = { "Content-type": "application/json" })\n' +
          '';

      return code;
    };
    Blockly.Python['web_get_data'] = function (block) {
      var op = block.getFieldValue('op');
      var code = '_SEND_HTTP_REQUEST.text';
      if (op == "text") {
        code = '_SEND_HTTP_REQUEST.text';
      } else if (op == "content") {
        code = '_SEND_HTTP_REQUEST.content';
      } else if (op == "state") {
        code = '_SEND_HTTP_REQUEST.status_code';
      } else if (op == "json") {
        code = '_SEND_HTTP_REQUEST.json()';
      } else if (op == "code") {
        code = '_SEND_HTTP_REQUEST.encoding';
      } else if (op == "reason") {
        code = '_SEND_HTTP_REQUEST.reason';
      }
      return [code, Blockly.Python.ORDER_CONDITIONAL];
    };

    Blockly.Python['dict_get'] = function(block) {
      var dict = Blockly.Python.valueToCode(block, 'DICT',
          Blockly.Python.ORDER_MEMBER) || '{}';
      var value = Blockly.Python.valueToCode(block, 'ITEM',
          Blockly.Python.ORDER_NONE) || 'None';
      var code = dict + '[' + value + ']';
      return [code, Blockly.Python.ORDER_ATOMIC];
    };
    Blockly.Python['dicts_create_empty'] = function(block) {
      // Create an empty list.
      return ['{}', Blockly.Python.ORDER_ATOMIC];
    };
    return Blockly.defineBlocksWithJsonArray([
      {
        'type': 'dicts_create_empty',
        'message0': '创建空字典',
        'output': '',
        "colour": "260",
        'tooltip': '',
        'helpUrl': '',
      },
      {
        'type': 'web_get_data',
        'message0': '获取HTTP响应内容的%1',
        "args0": [
          {
            "type": "field_dropdown",
            "name": "op",
            'options': [
              ['text', 'text'],
              ['content', 'content'],
              ['state', 'state'],
              ['json', 'json'],
              ['code', 'code'],
              ['reason', 'reason'],
            ],
          }
        ],
        'output': null,
        'helpUrl': '',
        "colour": "#183895",
        'tooltip': '',
      },
      {
        'type': 'network_http_get',
        'message0': '发送HTTP GET请求',
        'message1': '设置目标网址:%1',
        'args1': [
          {
            'type': 'input_value',
            'name': 'http_get_url',
          },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#183895",
        "tooltip": "Returns number of letters in the provided text.",
        'helpUrl': '',
      },
      {
        'type': 'network_http_post',
        'message0': '发送HTTP post请求',
        'message1': '设置目标网址:%1',
        'args1': [
          {
            'type': 'input_value',
            'name': 'http_post_url',
          },
        ],
        'message2': '提交数据(JSON):%1',
        'args2': [
          {
            'type': 'input_value',
            'name': 'data',
          },
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#183895",
        "tooltip": "Returns number of letters in the provided text.",
        'helpUrl': '',
      },
      {
        "type": "led_matrix_show_above",
        "message0": "LED灯屏模块显示生效",
        "colour": "#e8795b",
        'inputsInline': true,
        "previousStatement": null,
        "nextStatement": null,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        'type': 'led_matrix_wh',
        'message0': '宽:%1 高:%2',
        'args0': [
          {
            'type': 'input_value',
            'name': 'w',
            'check': 'Number',
          },
          {
            'type': 'input_value',
            'name': 'h',
            'check': 'Number',
          },
        ],
        'inputsInline': true,
        'output': 'Number',
        "colour": "#e8795b",
        'tooltip': '',
        'helpUrl': '',
      },
      {
        'type': 'led_matrix_xy',
        'message0': '列:%1 行:%2',
        'args0': [
          {
            'type': 'input_value',
            'name': 'x',
            'check': 'Number',
          },
          {
            'type': 'input_value',
            'name': 'y',
            'check': 'Number',
          },
        ],
        'inputsInline': true,
        'output': 'Number',
        "colour": "#e8795b",
        'tooltip': '',
        'helpUrl': '',
      },
      {
        'type': 'led_matrix_colour_picker',
        'message0': '颜色 %1',
        'args0': [
          {
            'type': 'field_colour',
            'name': 'COLOUR',
            'colour': '#ff0000',
          },
        ],
        'output': 'Colour',
        'helpUrl': '',
        "colour": "#e8795b",
        'tooltip': '',
        'extensions': ['parent_tooltip_when_inline'],
      },
      {
        "type": "led_matrix_draw_rectangle",
        "message0": 'LED灯屏模块 ',
        "message1": '绘制矩形',
        "message2": '颜色: %1',
        "message3": '坐标: %1',
        "message4": '尺寸: %1',
        'args2': [
          {
            'type': 'input_value',
            'name': 'colour',
          },
        ],
        'args3': [
          {
            'type': 'input_value',
            'name': 'coordinate',
          },
        ],
        'args4': [
          {
            'type': 'input_value',
            'name': 'size',
          },
        ],
        "colour": "#e8795b",
        "previousStatement": null,
        "nextStatement": null,
        "tooltip": "Returns number of letters in the provided text.",
        "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
      },
      {
        "type": "led_matrix_setup",
        "message0": 'LED灯屏模块(6x6)初始化设置 ',
        "message1": '设置灯屏引脚 %1',
        "message2": '设置灯屏亮度为：%1 (亮度范围：0~255)',
        "args1": [
          {
            "type": "field_dropdown",
            "name": "io",
            'options': [
              ['25', '25'],
              ['15', '15'],
            ],
          }
        ],
        "args2": [
          {
            "type": "field_number",
            "name": "brightness",
            "value":50,
          }
        ],
        "colour": "#e8795b",
        "previousStatement": null,
        "nextStatement": null,
        "tooltip": "Returns number of letters in the provided text.",
        "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
      },
      {
        'type': 'controls_ifelse',
        'message0': '如果 %1',
        'args0': [
          {
            'type': 'input_value',
            'name': 'IF0',
            'check': 'Boolean',
          },
        ],
        'message1': '执行 %1',
        'args1': [
          {
            'type': 'input_statement',
            'name': 'DO0',
          },
        ],
        'message2': '否则执行 %1',
        'args2': [
          {
            'type': 'input_statement',
            'name': 'ELSE',
          },
        ],
        'previousStatement': null,
        'nextStatement': null,
        'tooltip': '',
        'helpUrl': '',
        'style': 'logic_blocks',
        'suppressPrefixSuffix': true,
        'extensions': ['controls_if_tooltip'],
      },
      {
        "type": "controls_repeat_forever",
        "message0": "一直循环",
        'message1': '执行 %1',
        'args1': [{
          'type': 'input_statement',
          'name': 'DO',
        }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "servos",
        "message0": '舵机 ',
        "message1": 'pin_num(0-15)：%1',
        "message2": '设置舵机角度：%1',
        "args1": [
          {
            "type": "input_value",
            "name": "PIN_NUM",
            "check": "Number"
          }
        ],
        "args2": [
          {
            "type": "input_value",
            "name": "DEGREES",
            "check": "Number"
          }
        ],
        "colour": 160,
        "previousStatement": null,
        "nextStatement": null,
        "tooltip": "Returns number of letters in the provided text.",
        "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
      },
      {
        "type": "esp32_support",
        "message0": "ESP32支持",
        "colour": 300,
        "tooltip": "",
        "helpUrl": "ESP32支持"
      },
      {
        "type": "esp32_led",
        "message0": "定义LED灯 %1",
        "args0": [
          {
            "type": "input_value",
            "name": "PIN_NUMBER"
          }
        ],
        "inputsInline": true,
        "output": null,
        "colour": 330,
        "tooltip": "ESP32 LED",
        "helpUrl": ""
      },
      {
        "type": "turn_on_off_led",
        "message0": "点亮/点灭LED %1 %2 %3",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_variable",
            "name": "led_variable",
            "variable": "item"
          },
          {
            "type": "input_value",
            "name": "turn_on_led"
          }
        ],
        "previousStatement": null,
        "colour": 230,
        "tooltip": "点亮LED",
        "helpUrl": ""
      },
      {
        "type": "ad_turn_on_off_led",
        "message0": "点亮/熄灭LED ",
        "message1": "pin_num: %1",
        "message2": "点亮/熄灭(1/0): %1",
        "args1": [
          {
            "type": "input_value",
            "name": "PIN_NUM",
            "check": "Number"
          }
        ],
        "args2": [
          {
            "type": "input_value",
            "name": "STATE",
            "check": "Number"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "点亮LED",
        "helpUrl": ""
      },
      {
        "type": "ad_thermal_humidity_sensor",
        "message0": "温湿度传感器程序 ",
        "message1": "led_pin_num: %1",
        "message2": "dht_pin_num: %1",
        "args1": [
          {
            "type": "input_value",
            "name": "LED_PIN_NUM",
            "check": "Number"
          }
        ],
        "args2": [
          {
            "type": "input_value",
            "name": "DHT_PIN_NUM",
            "check": "Number"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 85,
        "tooltip": "",
        "output": "tuple",
        "helpUrl": ""
      },
      {
        "type": "ad_ultra_sound_sensor",
        "message0": "超声波传感器程序 ",
        "message1": "trig_pin_num: %1",
        "message2": "echo_pin_num: %1",
        "args1": [
          {
            "type": "input_value",
            "name": "TRIG_PIN_NUM",
            "check": "Number"
          }
        ],
        "args2": [
          {
            "type": "input_value",
            "name": "ECHO_PIN_NUM",
            "check": "Number"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 295,
        "output" : "Number",
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "ad_infrared_sensor",
        "message0": "红外传感器例程 ",
        "message1": "pin_num: %1",
        "args1": [
          {
            "type": "input_value",
            "name": "PIN_NUM",
            "check": "Number"
          }
        ],

        "previousStatement": null,
        "nextStatement": null,
        "colour": 211,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "main_controller_wifi_connect_internet",
        "message0": "连接WIFI网络 ",
        "message1": "SSID: %1",
        "message2": "密码: %1",
        "args1": [
          {
            "type": "input_value",
            "name": "ssid",
            "check": "String"
          }
        ],
        "args2": [
          {
            "type": "input_value",
            "name": "password",
            "check": "String"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#386dc8",
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "main_controller_get_wifi_connection_status",
        "message0": "获取WIFI连接状态 ",
        "colour": "#386dc8",
        "tooltip": "",
        "output": "Boolean",
        "helpUrl": ""
      },
      {
        "type": "ultra_sound_sensor",
        "message0": "超声波传感器例程",
        "colour": 295,
        "tooltip": "超声波传感器例程",
        "helpUrl": ""
      },
      {
        "type": "infrared_sensor",
        "message0": "红外传感器例程",
        "colour": 211,
        "tooltip": "红外传感器例程",
        "helpUrl": ""
      }
    ])
  }

  return {
    blocklyInit: blocklyInit,
    getXmlToolbox: getXmlToolbox,
    defaultToolboxJson: toolboxJson,
  }
}()
