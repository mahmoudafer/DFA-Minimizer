const readline = require('readline'),
	isEqual = require('lodash.isequal')

const Node = (id, parent, final = false) => {
    return {
        height: -1,
		id,
		parent,
		final,
		alphabets: {},
		printFactor: 0
    }
}

class dafsa {
    constructor () {
        this.id = 1
		this.head = Node(0, null)
		this.printFactor = 0
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
			current.alphabets[letter] = Node(this.id, current, final)
			this.id++
		}
		return current.alphabets[letter]
	}

	minimize () {
		let leafNodes = this.getLeafNodes(), leafNodesParents, newHeight = 0, newId = 1, nodeKeys
		while (this.head.height == -1) {
			leafNodesParents = [...new Set(leafNodes.map(node => node.parent))] //remove duplicates
			for (let i = 0; i < leafNodes.length; i++) {
				for (let j = i + 1; j < leafNodes.length; j++) {
					if (leafNodes[i].final == leafNodes[j].final && isEqual(leafNodes[i].alphabets, leafNodes[j].alphabets)) {
						for (let alphabet in leafNodes[j].parent.alphabets) {
							if (leafNodes[j].parent.alphabets[alphabet].id === leafNodes[j].id) {
								leafNodes[j].parent.alphabets[alphabet] = leafNodes[i]
								leafNodes.splice(j, 1)
								j--
								break
							}
						}
					}
				}
				leafNodes[i].height = newHeight
				leafNodes[i].id = newId
				newId++
				//nodeKeys = Object.keys(leafNodes)
			}
			newHeight++
			newId = 1
			leafNodes = leafNodesParents[0] && leafNodesParents.filter(node => Object.keys(node.alphabets).reduce((acc, val) => acc && node.alphabets[val].height != -1, true ))
		}
	}

	getLeafNodes (node = this.head) {
		if (!Object.keys(node.alphabets).length)
			return [node]
		const leafNodes = []
		for (let alphabet in node.alphabets)
			leafNodes.push(...this.getLeafNodes(node.alphabets[alphabet]))
		return leafNodes
	}

	print (node = this.head) {
		node == this.head && this.printFactor++
		if (node.printFactor < this.printFactor) {
			console.log(node.height + ", " + node.id)
			node.printFactor++
		}
		if (Object.keys(node.alphabets).length)
			for (let alphabet in node.alphabets)
				this.print(node.alphabets[alphabet])
	}

	test (str) {
		let current = this.head
		for (let i = 0; i < str.length; i++) {
			current = current.alphabets[str.charAt(i)]
			if (!current)
				break
		}
		return current && current.final
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

console.log("Enter each string on a new line: ")

const dafsaInst = new dafsa()

rl.on('line', (input) => {
	if (input == "min") return dafsaInst.minimize()
	if (input == "print") return dafsaInst.print()
	if (input.startsWith("test"))
		console.log(input.substr(5, input.length) + (dafsaInst.test(input.substr(5, input.length)) ? " is recognised" : " is NOT recognised"))
	input !== "" && dafsaInst.insertString(input)
})