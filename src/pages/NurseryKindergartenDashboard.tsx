import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";

const nurseryLinks = [
	{
		title: "Strokes PreSchool",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/Strokes-PreSchool.html",
		description: "Learn basic strokes and patterns for preschoolers.",
	},
	{
		title: "Practice ABCD",
		url: "https://moodbanao.net/wp-content/uploads/2024/04/PracticeABCD.html",
		description: "Practice the alphabet with interactive activities.",
	},
	{
		title: "Practice Numbers",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/PracticeNumbers.html",
		description: "Fun number practice for young learners.",
	},
	{
		title: "Sound Of Alphabet",
		url: "https://moodbanao.net/wp-content/uploads/2024/05/SoundOfAlphabet.html",
		description: "Learn the sounds of each alphabet letter.",
	},
	{
		title: "Ready Puzzle",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/Readypuzzel.html",
		description: "Engaging puzzles for kids.",
	},
	{
		title: "Lowercase Puzzle",
		url: "https://moodbanao.net/wp-content/uploads/2024/05/LowercasePuzzle.html",
		description: "Practice lowercase letters with puzzles.",
	},
	{
		title: "Number Puzzle",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/numberpuzzle.html",
		description: "Number puzzles for early learners.",
	},
	{
		title: "Nursery Alphabet",
		url: "https://moodbanao.net/wp-content/uploads/2024/02/nurseryalphabet.html.html",
		description: "Learn nursery alphabets interactively.",
	},
	{
		title: "123 Numbers",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/123.html",
		description: "Practice numbers for nursery kids.",
	},
	{
		title: "Nursery Rhymes",
		url: "https://moodbanao.net/wp-content/uploads/2024/03/nurseryryhmes.html",
		description: "Enjoy classic nursery rhymes.",
	},
];

export default function NurseryKindergartenDashboard() {
	return (
		<AppLayout>
			<div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 flex flex-col items-center">
				<h1 className="text-3xl font-bold mb-6 text-pink-700 text-center">
					Nursery & Kindergarten Dashboard
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
					{nurseryLinks.map((link) => (
						<a
							key={link.url}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-2xl shadow-lg bg-white hover:bg-pink-50 border-2 border-pink-200 hover:border-pink-400 p-6 flex flex-col items-center transition-all duration-200"
						>
							<h2 className="text-xl font-bold text-pink-600 mb-2 text-center">
								{link.title}
							</h2>
							<p className="text-gray-700 text-center mb-4">
								{link.description}
							</p>
							<span className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold shadow hover:bg-pink-600 transition-all">
								Open
							</span>
						</a>
					))}
				</div>
				{/* App name and link at the end */}
				<div className="mt-10 flex flex-col items-center">
					<a
						href="https://play.google.com/store/apps/details?id=com.salman123342.moodbanao&hl=en&gl=US"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="text-pink-700 font-semibold text-lg">
							Get the MoodBanao App
						</div>
					</a>
				</div>
			</div>
		</AppLayout>
	);
}
