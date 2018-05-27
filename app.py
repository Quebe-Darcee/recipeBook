import json
from flask import Flask
from flask import render_template, request, redirect
from jinja2 import Markup, escape

app = Flask(__name__)

@app.template_filter()
def nl2br(value):
    result = escape(value).replace('\n', Markup('<br>\n'))
    return Markup(result)

def save(recipes):
   with open("recipes.json", "w") as f:
      json.dump(recipes, f)

def load():
   with open("recipes.json", "r") as f:
      return json.load(f)


@app.route("/")
def hello():
   return render_template('index.html', recipes=load())

@app.route("/add")
def add():
   return render_template('add.html')

@app.route("/favorites")
def favorites():
  return render_template('favorites.html', recipes=json.dumps(load()))

@app.route("/recipes")
def index():
   return render_template('recipes.html', recipes=load())

@app.route("/recipe", methods=['POST'])
def create():
   name = request.form["name"]
   ingredients = request.form["ingredients"]
   directions = request.form["directions"]
   image = request.form["image"]

   recipes = load()
   recipes[name] = {
      'ingredients': ingredients,
      'directions': directions,
      'image': image
   }
   save(recipes)
   return redirect("/recipes")

if __name__ == "__main__":
    app.run(debug=True)