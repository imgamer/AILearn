"""
大语言模型应用和微调

数据准备：通义千问的开源模型
模型：Qwen2.5-0.5B-Instruct
微调数据库？：tatsu-lab-alpaca

环境准备：
conda create -n llms python=3.11
pip install notebook
pip install torch transformers    # torch和transformers在这里分别起到什么作用
pip install datasets trl peft

可以在jupyter notebook中使用pip安装，!pip install torch transformers，前面加!感叹号。
!pip install datasets trl peft    # 安装数据库，datasets是个著名轻量级数据库，可以去了解一下

去到大模型文件夹目录启动 jupyter notebook，这样工作目录就在这里，比较好处理
jupyter notebook

查看当前环境的python解释器：
where python
pip list 查看所有安装包
pip show torch 查看指定安装包
"""

from transformers import AutoModelForCausalLM, AutoTokenizer

#从预训练的模型里面加载参数
model = AutoModelForCausalLM.from_pretrained(
    'Qwen2.5-0.5B-Instruct',
    torch_dtype='auto'
)
print(model)

#加载token模型
tokenizer = AutoTokenizer.from_pretrained('Qwen2.5-0.5B-Instruct')

#给大模型的输入;system是全局设定;user给大模型的问题
message = [
    {'role': 'system', 'content': '你是千问，一个有用的人工智能。'},
    {'role': 'user', 'content': '我爱北京'}
]

#给上面的message加标记;最后一行<|im_start|>assistant告诉大模型可以回答问题了
text = tokenizer.apply_chat_template(
    message,
    tokenize=False,
    add_generation_prompt=True
)
#print(text)

#把text变成token,即数字;attention_mask全是1表示大模型可以看到全部的输入
model_inputs = tokenizer([text], return_tensors='pt').to('cpu')
print(model_inputs)

#大模型生成回答,要等待运行一段时间
generated_ids = model.generate(**model_inputs, max_new_tokens=512)
print(generated_ids)

#把输入部分去掉
generated_ids = [output_ids[len(input_ids):]
                            for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)]
print(generated_ids)

#把数字转换成文字
response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
print(response)

from datasets import load_dataset
from trl import SFTConfig, SFTTrainer
from peft import LoraConfig

dataset = load_dataset("tatsu-lab-alpaca", split="train")

peft_config = LoraConfig(
    r=8,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

trainer = SFTTrainer(
    'Qwen2.5-0.5B-Instruct',
    train_dataset=dataset,
    args=SFTConfig(output_dir="tmp"),
    peft_config=peft_config,
    dataset_text_field='instruction'
)