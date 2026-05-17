export type Person = {
	id: number
	firstName: string
	lastName: string
	age: number
	visits: number
	status: 'relationship' | 'complicated' | 'single'
	progress: number
}

const firstNames = ['Ada', 'Maya', 'Noah', 'Ava', 'Liam', 'Iris', 'Ezra', 'Mila']
const lastNames = ['Stone', 'Rivera', 'Patel', 'Nguyen', 'Carter', 'Kim', 'Lopez', 'Reed']
const statuses: Person['status'][] = ['relationship', 'complicated', 'single']

export function makeData(count: number): Person[] {
	return Array.from({ length: count }, (_, index) => ({
		id: index + 1,
		firstName: firstNames[index % firstNames.length] ?? 'Alex',
		lastName: lastNames[index % lastNames.length] ?? 'Taylor',
		age: 18 + (index % 50),
		visits: (index * 7) % 1000,
		status: statuses[index % statuses.length] ?? 'single',
		progress: (index * 13) % 100,
	}))
}
