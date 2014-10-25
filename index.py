import web
import scrabble

web.config.debug = True

urls = ('/', 'index')
render = web.template.render('templates/')

dictionary = open("ospd.txt")
listWords = []

for line in dictionary: 
	line = line.split();
	listWords.append(line[0])

class index:
	def GET(self):
		if web.input():
			webInput = web.input()
			if webInput["request"] == "lookup":
				return scrabble.binary_search(webInput["word"], listWords, False)[1]
				print scrabble.binary_search(webInput["word"], listWords, False)[1]
			if webInput["request"] == "generate":
				print "Generate request with: " + webInput["letters"] + " " + webInput["boardWord"] + "."
				scrabble.answers_global = []
				scrabble.generate_words_board(webInput["letters"], webInput["boardWord"], listWords)
				scrabble.answers_global = set(scrabble.answers_global)
				scrabble.answers_global = list(scrabble.answers_global)
				scrabble.answers_global.sort(lambda x,y: cmp(len(x), len(y)))
				print scrabble.answers_global
				return scrabble.answers_global

		else:
			return render.index()

if __name__ == "__main__": 
    app = web.application(urls, globals())
    app.run()        