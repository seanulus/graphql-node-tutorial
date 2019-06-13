const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
	const userId = getUserId(context)
	return context.prisma.createLink({
		url: args.url,
		description: args.description,
		postedBy: { connect: { id: userId } },
	})
}

async function signup(parent, args, context, info) {

	const password = await bcrypt.hash(args.password, 10)

	const user = await context.prisma.createUser({ ...args, password })

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function login(parent, args, context, info) {

	const user = await context.prisma.user({ email: args.email })
	if(!user) {
		throw new Error('No User Found')
	}

	const valid = await bcrypt.compare(args.password, user.password)
	if(!valid) {
		throw new Error('Invalid Password')
	}

	const token = jwt.sign({ userId: user.id}, APP_SECRET)

	return {
		token,
		user,
	}
}

async function vote(parent, args, context, info) {
	const userId = getUserId(context)

	const linkExists = await context.prisma.$exists.vote({
		user: { id: userId },
		link: { id: args.linkId },
	})
	if (linkExists) {
		throw new Error(`Already voted for this link: ${args.linkId}`)
	}

	return context.prisma.createVote({
		user: { connect: { id: userId } },
		link: { connect: { id: args.linkId } }
	})
}

	// update: (parent, args) => {
	// 	let link = links.find(link => link.id === args.id)
	// 	if(link === undefined) {
	// 		throw new Error(`Could not find link with ID ${args.id}`);
	// 	}
	// 	if(args.url !== null) {
	// 		link.url = args.url;
	// 	}
	// 	if(args.description !== null) {
	// 		link.description = args.description;
	// 	}
	// 	return link;
	// },

	// 	delete: (parent, args) => {
	// 		let newLinks = links.filter(link => link.id !== args.id)
	// 		links = newLinks
	// 		return `You have succesfully deleted the link with ID: ${args.id}`
	// 	}
	// },

module.exports = {
	signup,
	login,
	post,
	vote,
}