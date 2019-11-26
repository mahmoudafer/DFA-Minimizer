const readline = require('readline'),
	pick = require('lodash.pick')

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

	minimize () {
		let leafNodes = this.getLeafNodes(), leafNodesParents, newHeight = 0
		// while (this.head.height < 0) {
			leafNodesParents = leafNodes.map(node => node.parent).filter(node => Object.keys(node.alphabets).reduce((acc, val) => acc && node.alphabets[val].height == -1, true ))
			leafNodes = pick(leafNodesParents, [...new Set(Object.keys(leafNodesParents))])
		// }
		console.log(leafNodes)
	}

	getLeafNodes (node = this.head) {
		if (!Object.keys(node.alphabets).length)
			return [node]
		const leafNodes = []
		for (let alphabet in node.alphabets)
			leafNodes.push(...this.getLeafNodes(node.alphabets[alphabet]))
		return leafNodes
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const dafsaInst = new dafsa()
console.log("Enter each string on a new line: ")
rl.on('line', (input) => {
	input !== "" && dafsaInst.insertString(input)
	console.log(dafsaInst.getLeafNodes())
	console.log(dafsaInst.minimize())
})