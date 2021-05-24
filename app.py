import json
import requests
import Algorithmia
from CGRtools import smiles
from pubchempy import Compound, get_compounds
from flask import Flask, render_template, url_for, request


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predict', methods=['GET','POST'])
def predict():
    client = Algorithmia.client('simtds2YG9Ed/wd5xucmvHy+U8G1')
    algo = client.algo('Dmitry_BV/predictor/1.1.2')
    algo.set_options(timeout=100) # optional 
    smi = request.args.get('post')
    beamSize = request.args.get('beamSize')
    model = request.args.get('model')

    input_query = {"reaction": smi, 'beamWidth': int(beamSize), "model": model}
    answers = algo.pipe(input_query).result["product"]
    reaction = smi + ">>" + answers
    img = get_svg(reaction)

    return json.dumps({'prediction': str(reaction), 'reaction': img})


@app.route('/image', methods=['GET','POST'])
def image():
    post = request.args.get('post')
    img = get_svg(post)
    
    return json.dumps({'img': img}); 


@app.route('/smiles', methods=['GET','POST'])
def get_smiles():
    """
    Get SMILES string for IUPAC names
    Web translation API: SYSTRAN.io
    """
    smiles_list = []
    string = request.args.get('post')
    string = string.replace(",", ".")
    string = string.split(".")
    source_lang = request.args.get('lang')
    url = "https://systran-systran-platform-for-language-processing-v1.p.rapidapi.com/translation/text/translate"
    headers = {
    'x-rapidapi-key': "28bb9cac94msh0d21dd8efbc884ep1172f0jsndc7797830a0e",
    'x-rapidapi-host': "systran-systran-platform-for-language-processing-v1.p.rapidapi.com"
    }

    for i in range(len(string)):
        if source_lang != "en":
            # If source lang. is not English, perform translation
            querystring = {"source": source_lang, "target":"en", "input":string[i]}
            response = requests.request("GET", url, headers=headers, params=querystring)
            response = json.loads(response.text)
            string[i] = response['outputs'][0]['output'].lower().lstrip(" ").lstrip("the")
        try:
            smi = str(smiles(get_compounds(string[i], "name")[0].canonical_smiles))
            smiles_list.append(smi)
        except IndexError:
            continue
    smiles_list = ".".join(smiles_list)
    img = get_svg(smiles_list)

    return json.dumps({'smiles': smiles_list, 'img': img}); 


def get_svg(smi):
    """
    Return "..." if SMILES is not finished or contains errors
    Customization of bonds and fonts enabled
    """
    svg = smiles(smi)
    customize = True
    try:
        svg.clean2d()
        svg = svg.depict()
        if customize:
            svg = svg.replace('<g fill="#101010" font-family="sans-serif">', '<g fill="#101010" font-family="sans-serif">')
            svg = svg.replace('<g fill="none" stroke="black" stroke-width="0.04"', 
                            '<g fill="none" stroke="black" stroke-width="0.06"')
            svg = svg.replace('<g fill="#0305A7" font-size="0.25"', '<g fill="#0305A7" font-size="0.3"')
    except AttributeError:
        svg = "..."
    return svg

if __name__ == "__main__":
    app.run(debug=True)