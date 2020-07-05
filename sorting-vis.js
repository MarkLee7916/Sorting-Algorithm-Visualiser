"use strict";

const array = [];
const MIN_ARRAY_LENGTH = 20;
const MAX_ARRAY_LENGTH = 100;

const global = {
    length : -1,
    speed : 10,
	currentAlgorithm: undefined
}

// Maps the algorithm selection buttons innerHTML onto the actual algorithms
const pickAlgorithm = new Map([
	["Insertion Sort", insertionSort],
	["Selection Sort", selectionSort],
	["Quick Sort", quickSort],
	["Heap Sort", heapSort]
]);

generateNewStepArray();
addEventListeners();

async function run() {
	if (isSorted())
		alert("Array already sorted!");
	else if (global.currentAlgorithm === undefined)
		alert("No algorithm selected!");
	else {
		removeEventListenersToStopInterrupts();
		await global.currentAlgorithm();			
		addEventListeners();
	}
}

// Helper function for run()
function isSorted() {
	for (let i = 1; i < global.length; i++) 
		if (array[i - 1] > array[i])
			return false;

	return true;
}

// Generate an array where the bars are a random height
function generateNewRandomArray() {
	const minBarSize = 10;
	const maxBarSize = 500;

	clearArray();

	global.length = rng(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);

	for (let i = 0; i < global.length; i++) 
		array.push(rng(minBarSize, maxBarSize));	

	createVisualBarsFromArray();
}

// Generate new array which when sorted forms a triangle
function generateNewStepArray() {
	clearArray();

	global.length = rng(MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH);

	for (let i = 0; i < global.length; i++) 
		array.push(i * 6);	

	shuffleNoAnimation();
	createVisualBarsFromArray();	
}

// Helper function for generating new arrays
function clearArray() {
	array.length = 0;
}

// Helper function for generateNewStepArray()
function shuffleNoAnimation() {
	array.sort(() => Math.random() - Math.random());
}

function addEventListeners() {
	addEventListenerForRun();
	addEventListenersForArrayGeneration();
	addEventListenerForShuffle();
	addEventListenersForAlgoSelection();
	addEventListenerForSpeedSlider();
}

function addEventListenerForRun() {
	const runDOM = document.querySelector("#run");

	runDOM.addEventListener("click", run);	
}

function addEventListenersForArrayGeneration() {
	const randArrayDOM = document.querySelector("#rand-array");
	const stepArrayDOM = document.querySelector("#step-array");

	randArrayDOM.addEventListener("click", generateNewRandomArray);	
	stepArrayDOM.addEventListener("click", generateNewStepArray);
}

function addEventListenerForShuffle() {
	const shuffleDOM = document.querySelector("#shuffle");

	shuffleDOM.addEventListener("click", shuffle);	
}

function addEventListenersForAlgoSelection() {
	const algoSelectionMenu = document.querySelectorAll(".select-algo");

	for (let i = 0; i < algoSelectionMenu.length; i++) 
		algoSelectionMenu[i].addEventListener("click", handleUserAlgorithmSelection);	
}

function addEventListenerForSpeedSlider() {
	const sliderDOM = document.querySelector("#speed-toggle");

	sliderDOM.addEventListener("change", updateSpeed);
}

// Temporarily remove event listeners for functions you don't want interrupting another function
// i.e this prevents the user trying to generate a new array while the previous one is still being sorted
function removeEventListenersToStopInterrupts() {
	removeEventListenerForRun();
	removeEventListenersForArrayGeneration();
	removeEventListenerForShuffle();
}

function removeEventListenerForRun() {
	const runDOM = document.querySelector("#run");

	runDOM.removeEventListener("click", run);	
}

function removeEventListenersForArrayGeneration() {
	const randArrayDOM = document.querySelector("#rand-array");
	const stepArrayDOM = document.querySelector("#step-array");

	randArrayDOM.removeEventListener("click", generateNewRandomArray);	
	stepArrayDOM.removeEventListener("click", generateNewStepArray);
}

function removeEventListenerForShuffle() {
	const shuffleDOM = document.querySelector("#shuffle");

	shuffleDOM.removeEventListener("click", shuffle);	
}

// Handle user selecting which algorithm they want to run
function handleUserAlgorithmSelection(clickable) {
	const algoButton = clickable.target;
	const barColor = "#7FDBFF";

	resetAlgoButtonColorsToDefault();
	algoButton.style.color = barColor;

	global.currentAlgorithm = pickAlgorithm.get(algoButton.innerHTML);
}

// Reset all of the algorithm selection buttons to their default colour of white
function resetAlgoButtonColorsToDefault() {
	const algoSelectionMenu = document.querySelectorAll(".select-algo");

	for (let i = 0; i < algoSelectionMenu.length; i++) 
		algoSelectionMenu[i].style.color = "white";
}

// Change speed of algorithm based on user changing value of slider
function updateSpeed(clickable) {
	const slider = clickable.target;

	global.speed = parseInt(slider.value);
}

function createVisualBarsFromArray() {	
	clearVisualBars();

	const containerDOM = document.querySelector("#bar-container");

	for (let i = 0; i < global.length; i++) 
		containerDOM.append(createNewVisualBar(i));	
}

// Helper function for createVisualBarsFromArray()
function clearVisualBars() {
	const containerDOM = document.querySelector("#bar-container");

	containerDOM.innerHTML = '';
}

// Helper function for createVisualBarsFromArray()
function createNewVisualBar(index) {
	const newBar = document.createElement("div");
	const defaultHeight = 100;

	newBar.className = "bar";
	newBar.setAttribute("style", "height: " + defaultHeight + "px");
	newBar.setAttribute("style", "height: " + array[index] + "px");

	return newBar;
}

async function insertionSort() {	
	var j;

	for (let i = 0; i < global.length; i++) {
		j = i;
		while (j >= 1 && array[j] < array[j - 1])
			await swap(j, --j);
	}
}

async function selectionSort() {	
	var min;

	for (let limit = 0; limit < global.length; limit++) {
		min = indexOfMinElement(limit);
		await swap(limit, min);
	}
}

// Helper function for selectionSort. Only considers elements of index greater than indexLimit
function indexOfMinElement(indexLimit) {	
	var min = Infinity;
	var minIndex;

	for (let i = indexLimit; i < global.length; i++) {
		if (array[i] <= min) {
			minIndex = i;
			min = array[i];
		}
	}
	
	return minIndex;
}

// Wrapper for quickSortBody() to abstract out the initial parameters
async function quickSort() {
	await quickSortBody(0, global.length - 1);
}

async function quickSortBody(lower, upper) {
	if (lower < upper) {
		let pivot = await partition(lower, upper);

		await quickSortBody(lower, pivot - 1);
		await quickSortBody(pivot + 1, upper);
	}
}

// Helper function for quickSort, partition section of array between lower and upper and return index of pivot
async function partition(lower, upper) {
	const pivot = array[upper];
	var i = lower;

	for (let j = lower; j <= upper; j++) {
		if (array[j] < pivot) {
			await swap(i, j);
			i++;
		}
	}

	await swap(i, upper);

	return i;
}

async function heapSort() {
	await buildHeap();

	for (let i = global.length - 1; i > 0; i--) {
		await swap(0, i);
		await heapify(0, i);
	}
}

async function buildHeap() {
    for (let i = Math.floor(global.length / 2) - 1; i >= 0; i--) 
        await heapify(i, global.length); 
}

async function heapify(root, cutoff) {
	var max = root;
	var left = 2 * root + 1;
	var right = 2 * root + 2;

	if (right < cutoff && array[right] > array[max])
		max = right;

	if (left < cutoff && array[left] > array[max])
		max = left;

	if (root != max) {
		await swap(root, max);
		await heapify(max, cutoff);
	}
}

// Swap items at the given indexes
function swap(i, j) {
	return new Promise((resolve) => {	
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;

		setTimeout(() => {
			renderSwapInView(i, j);
			resolve();
		}, global.speed);
	});
}

// Update the DOM based on element indices that were swapped by the algorithm
function renderSwapInView(i, j) {
	const containerDOM = document.querySelector("#bar-container");

	containerDOM.children[i].setAttribute("style", "height: " + array[i] + "px");
	containerDOM.children[j].setAttribute("style", "height: " + array[j] + "px");
}

async function shuffle() {
	removeEventListenersToStopInterrupts();	

	for (let i = 0; i < global.length; i++) 
		await swap(i, rng(0, global.length));

	addEventListeners();
}

// Generates a random number whose value lies between lower and upper
function rng(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}