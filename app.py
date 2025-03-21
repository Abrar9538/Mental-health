from flask import Flask, request, jsonify
from vllm import LLM, SamplingParams
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize the LLM
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)
llm = LLM(model="TheBloke/med42-70B-AWQ", quantization="awq", dtype="auto")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('prompt', '')
    
    prompt_template = f'''<|system|>: You are a helpful medical assistant created by M42 Health in the UAE.
<|prompter|>:{user_message}
<|assistant|>:
'''
    
    # Generate response
    outputs = llm.generate([prompt_template], sampling_params)
    response_text = outputs[0].outputs[0].text
    
    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(debug=True) 