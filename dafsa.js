const readline = require('readline')

const Node = (id, parent, final = false) => {
    return {
        height: -1,
		id,
		parent,
		final,
		alphabets: {}
    }
}

class dafsa {
    constructor () {
        this.id = 1
		this.head = Node(-1, 0)
	}

	insertString (str) {
		let i, current = this.head
		for (i = 0; i < str.length - 1; i++) {
			current = this.insertLetter(str.charAt(i), current, false)
		}
		this.insertLetter(str.charAt(i), current, true)
	}
	
	insertLetter (letter, current, final) {
		if (!current.alphabets[letter]) {
			const node = Node(this.id, current, final)
			current.alphabets[letter] = node
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