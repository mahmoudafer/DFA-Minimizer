const node = (height, id) => {
    return {
        height,
		id,
		alphabets: {}
    }
}

class dafsa {
    constructor () {
        this.id = 0
        this.head = node(-1, 0)
	}
	
	insert (letter) {
		let current = this.head
		while (current.alphabets[letter])
			current = current.alphabets[letter]
		current.alphabets[letter] = node(current.height, this.id)
		this.id++
	}
}