const readline = require('readline')

const node = (height, id, final = false) => {
    return {
        height,
		id,
		final,
		alphabets: {}
    }
}

class dafsa {
    constructor () {
        this.id = 1
        this.head = node(-1, 0)
	}

	insertString (str) {
		let i, current = this.head
		for (i = 0; i < str.length - 1; i++) {
			current = this.insertLetter(str.charAt(i), current)
		}
		this.insertLetter(str.charAt(i), current, true)
	}
	
	insertLetter (letter, current, final) {
		if (!current.alphabets[letter]) {
			current.alphabets[letter] = node(current.height - 1, this.id, final)
			this.id++
		}
		return current.alphabets[letter]
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const dafsaInst = new dafsa()

rl.question('Enter a string: ', (input) => {
	console.log(`Received: ${input}`)
	dafsaInst.insertString(input)
})