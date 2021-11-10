let nav = 0;
let clicked = null;
// * TO DO: firebase o localstore para manejar los eventos
let events = localStorage.getItem("events")
	? JSON.parse(localStorage.getItem("events"))
	: [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventText");
const weekdays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"thursday",
	"Friday",
	"Saturday",
];

function changeMonth(date) {
	date.setMonth(new Date().getMonth() + nav);
}

function openModal(date) {
	clicked = date;

	const eventForDay = events.find((e) => e.date === clicked);

	if (eventForDay) {
		document.getElementById('eventText').innerText = eventForDay.title;
		deleteEventModal.style.display = 'block';
	} else {
		newEventModal.style.display = "block";
	}
	backDrop.style.display = "block";
}

function loadCalendar() {
	const dt = new Date();

	if (nav !== 0) changeMonth(dt);

	const day = dt.getDay();
	const month = dt.getMonth();
	const year = dt.getFullYear();

	const firstDayOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
		"en-us",
		{ month: "long" }
	)} ${year}`;
	const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});
	const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

	calendar.innerHTML = "";
	console.log(paddingDays);
	for (let i = 1; i <= paddingDays + daysInMonth; i++) {
		const divSquare = document.createElement("div");
		const dayString = `${month + 1}/${i - paddingDays}/${year}`;
		divSquare.classList.add("day");
		if (i > paddingDays) {
			divSquare.innerHTML = i - paddingDays;
			const eventForDay = events.find(e => e.date === dayString);
			if (eventForDay) {
				const eventDiv = document.createElement('div');
				eventDiv.classList.add('event');
				eventDiv.innerText = eventForDay.title;
				divSquare.appendChild(eventDiv);
			}
			divSquare.addEventListener("click", () => openModal(dayString));
		} else {
			divSquare.classList.add("padding");
		}
		calendar.appendChild(divSquare);
	}
}

function saveEvent() {
	if (eventTitleInput.value) {
		eventTitleInput.classList.remove("error");
		events.push({
			date: clicked,
			title: eventTitleInput.value
		})
		localStorage.setItem("events", JSON.stringify(events))
		closeModal();
	} else {
		eventTitleInput.classList.add("error");
	}
}

function closeModal() {
	eventTitleInput.classList.remove("error")
	newEventModal.style.display = 'none';
	deleteEventModal.style.display = 'none';
	backDrop.style.display = 'none';
	eventTitleInput.value = "";
	clicked = null;
	loadCalendar();
}
function deleteEvent() {
	events = events.filter(e => e.date !== clicked);
	localStorage.setItem('events', JSON.stringify(events));
	closeModal();
  }
  
function initButtons() {
	document.getElementById("nextButton").addEventListener("click", () => {
		nav++;
		loadCalendar();
	});
	document.getElementById("backButton").addEventListener("click", () => {
		nav--;
		loadCalendar();
	});
	document.getElementById("saveButton").addEventListener("click", saveEvent);
	document.getElementById("cancelButton").addEventListener("click", closeModal);
	document.getElementById("closeButton").addEventListener("click", closeModal);
	document.getElementById("deleteButton").addEventListener("click", deleteEvent);

}

initButtons();
loadCalendar();
