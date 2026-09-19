/* =========================
   PARKING DATA
========================= */

const parkingData = {

    college: {
        name: "College Parking",
        fee: 0,
        feeText: "FREE"
    },

    hospital: {
        name: "Hospital Parking",
        fee: 20,
        feeText: "₹20 / hour"
    },

    mall: {
        name: "Shopping Mall Parking",
        fee: 30,
        feeText: "₹30 / hour"
    },

    airport: {
        name: "Airport Parking",
        fee: 50,
        feeText: "₹50 / hour"
    },

    office: {
        name: "Office Parking",
        fee: 0,
        feeText: "FREE"
    },

    cinema: {
        name: "Cinema Parking",
        fee: 20,
        feeText: "₹20 / hour"
    },

    stadium: {
        name: "Stadium Parking",
        fee: 40,
        feeText: "₹40 / hour"
    },

    public: {
        name: "Public Parking",
        fee: 10,
        feeText: "₹10 / hour"
    }

};


/* =========================
   PARKING PAGE
========================= */

const parkingPage =
    document.getElementById("selectedSlot");


if (parkingPage) {

    const params =
        new URLSearchParams(window.location.search);

    const location =
        params.get("location");


    if (
        location &&
        parkingData[location]
    ) {

        document.getElementById(
            "locationTitle"
        ).textContent =
            parkingData[location].name;

        document.getElementById(
            "locationInfo"
        ).textContent =
            "Parking Fee: " +
            parkingData[location].feeText;

    }

}


/* SELECT SLOT */
function selectSlot(slot) {

    if (slot.classList.contains("occupied")) {

        alert("This parking slot is already occupied.");

        return;
    }


    document.querySelectorAll(".slot")
        .forEach(function(item) {

            item.classList.remove(
                "selected-slot"
            );

        });


    slot.classList.add(
        "selected-slot"
    );


    const selected =
        slot.textContent.trim();


    const selectedSlot =
        document.getElementById(
            "selectedSlot"
        );


    if (selectedSlot) {

        selectedSlot.textContent =
            selected;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const location =
        params.get("location");


    if (
        location &&
        parkingData[location]
    ) {

        const fee =
            document.getElementById(
                "parkingFee"
            );


        if (fee) {

            fee.textContent =
                parkingData[location].feeText;

        }

    }

}


/* CONTINUE BOOKING */

function continueBooking() {

    const selected =
        document.getElementById(
            "selectedSlot"
        ).textContent;


    if (
        selected === "None" ||
        selected === ""
    ) {

        alert(
            "Please select an available parking slot."
        );

        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const location =
        params.get("location");


    window.location.href =
        "booking.html?location=" +
        location +
        "&slot=" +
        selected;

}


/* =========================
   BOOKING PAGE
   ---------------------------------------------------
   FIX: parking.html saves the chosen slot in
   localStorage under "selectedBooking" and redirects
   to booking.html with NO query string. This section
   used to look for ?location=&slot= in the URL, which
   never existed, so "data" was always undefined and
   the fee never showed. Now it reads the same
   localStorage object parking.html actually writes.
========================= */

const bookingForm =
    document.getElementById(
        "bookingForm"
    );


if (bookingForm) {

    const selectedBooking =
        JSON.parse(
            localStorage.getItem("selectedBooking")
        );


    if (!selectedBooking) {

        alert("Please select a parking slot first.");

        window.location.href = "locations.html";

    }


    const location =
        selectedBooking
            ? selectedBooking.locationKey
            : null;


    const slot =
        selectedBooking
            ? selectedBooking.slot
            : null;


    const data =
        location
            ? parkingData[location]
            : null;


    /* LOCATION */

    if (data) {

        document.getElementById(
            "summaryLocation"
        ).textContent =
            data.name;

    }


    /* SLOT */

    document.getElementById(
        "summarySlot"
    ).textContent =
        slot || "-";


    /* DURATION */

    const duration =
        document.getElementById(
            "duration"
        );


    duration.addEventListener(
        "change",
        calculateFee
    );


    function calculateFee() {

        const hours =
            Number(duration.value);


        if (!hours || !data) {

            document.getElementById(
                "summaryDuration"
            ).textContent =
                "-";

            document.getElementById(
                "totalFee"
            ).textContent =
                "-";

            return;
        }


        document.getElementById(
            "summaryDuration"
        ).textContent =
            hours + " Hour(s)";


        if (data.fee === 0) {

            document.getElementById(
                "totalFee"
            ).textContent =
                "FREE";

        } else {

            const total =
                data.fee * hours;


            document.getElementById(
                "totalFee"
            ).textContent =
                "₹" + total;

        }

    }


    /* SUBMIT BOOKING */

    bookingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const vehicleNumber =
                document.getElementById(
                    "vehicleNumber"
                ).value.trim();


            const vehicleType =
                document.getElementById(
                    "vehicleType"
                ).value;


            const date =
                document.getElementById(
                    "parkingDate"
                ).value;


            const hours =
                Number(
                    document.getElementById(
                        "duration"
                    ).value
                );


            /* VALIDATION */

            if (!name ||
                !phone ||
                !vehicleNumber ||
                !vehicleType ||
                !date ||
                !hours) {

                alert(
                    "Please fill all the details."
                );

                return;
            }


            if (!data) {

                alert(
                    "Parking location not found."
                );

                return;
            }


            /* TOTAL */

            const total =
                data.fee * hours;


            /* BOOKING ID */

            const bookingId =
                "SP" +
                Date.now()
                    .toString()
                    .slice(-6);


            /* BOOKING OBJECT */

            const booking = {

                id: bookingId,

                name: name,

                phone: phone,

                vehicleNumber:
                    vehicleNumber,

                vehicleType:
                    vehicleType,

                location:
                    data.name,

                slot:
                    slot,

                date:
                    date,

                duration:
                    hours,

                fee:
                    total

            };


            /* GET OLD BOOKINGS */

            let bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookings"
                    )
                );


            if (!Array.isArray(bookings)) {

                bookings = [];

            }


            /* ADD NEW BOOKING */

            bookings.push(
                booking
            );


            /* SAVE */

            localStorage.setItem(
                "bookings",
                JSON.stringify(
                    bookings
                )
            );


            /* CLEAR TEMP SELECTION */

            localStorage.removeItem(
                "selectedBooking"
            );


            /* OPEN RECEIPT */

            window.location.href =
                "confirmation.html?id=" +
                encodeURIComponent(
                    bookingId
                );

        }
    );

}


/* =========================
   CONFIRMATION PAGE
========================= */

const receipt =
    document.getElementById(
        "receipt"
    );


if (receipt) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const bookingId =
        params.get("id");


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "bookings"
            )
        ) || [];


    const booking =
        bookings.find(
            function(item) {

                return item.id ===
                    bookingId;

            }
        );


    if (booking) {

        document.getElementById(
            "bookingId"
        ).textContent =
            booking.id;


        document.getElementById(
            "receiptName"
        ).textContent =
            booking.name;


        document.getElementById(
            "receiptPhone"
        ).textContent =
            booking.phone;


        document.getElementById(
            "receiptLocation"
        ).textContent =
            booking.location;


        document.getElementById(
            "receiptSlot"
        ).textContent =
            booking.slot;


        document.getElementById(
            "receiptVehicle"
        ).textContent =
            booking.vehicleNumber;


        document.getElementById(
            "receiptVehicleType"
        ).textContent =
            booking.vehicleType;


        document.getElementById(
            "receiptDate"
        ).textContent =
            booking.date;


        document.getElementById(
            "receiptDuration"
        ).textContent =
            booking.duration +
            " Hour(s)";


        if (
            Number(booking.fee) === 0
        ) {

            document.getElementById(
                "receiptFee"
            ).textContent =
                "FREE";

        } else {

            document.getElementById(
                "receiptFee"
            ).textContent =
                "₹" + booking.fee;

        }

    } else {

        document.getElementById(
            "bookingId"
        ).textContent =
            "Booking not found";

    }

}/* =========================
   MY BOOKINGS PAGE
========================= */

const bookingList =
    document.getElementById(
        "bookingList"
    );


if (bookingList) {

    displayBookings();


    function displayBookings() {

        const bookings =
            JSON.parse(
                localStorage.getItem(
                    "bookings"
                )
            ) || [];


        const noBookings =
            document.getElementById(
                "noBookings"
            );


        if (bookings.length === 0) {

            bookingList.innerHTML = "";

            noBookings.style.display =
                "block";

            return;

        }


        noBookings.style.display =
            "none";


        bookingList.innerHTML = "";


        bookings
            .slice()
            .reverse()
            .forEach(function(booking) {


                const fee =
                    Number(booking.fee) === 0
                        ? "FREE"
                        : "₹" + booking.fee;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-card";


                card.innerHTML = `

                    <div class="booking-card-header">

                        <h2>
                            🅿️ ${booking.id}
                        </h2>

                        <span class="booking-status">
                            CONFIRMED
                        </span>

                    </div>


                    <div class="booking-details">


                        <div class="booking-detail">

                            <span>
                                Name
                            </span>

                            <strong>
                                ${booking.name}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Location
                            </span>

                            <strong>
                                ${booking.location}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Parking Slot
                            </span>

                            <strong>
                                ${booking.slot}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Vehicle
                            </span>

                            <strong>
                                ${booking.vehicleNumber}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Vehicle Type
                            </span>

                            <strong>
                                ${booking.vehicleType}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Date
                            </span>

                            <strong>
                                ${booking.date}
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Duration
                            </span>

                            <strong>
                                ${booking.duration}
                                Hour(s)
                            </strong>

                        </div>


                        <div class="booking-detail">

                            <span>
                                Total Fee
                            </span>

                            <strong>
                                ${fee}
                            </strong>

                        </div>


                    </div>


                    <div class="booking-actions">

                        <button
                            class="print-btn"
                            onclick="printBooking('${booking.id}')">

                            🖨️ Print

                        </button>


                        <button
                            class="cancel-btn"
                            onclick="cancelBooking('${booking.id}')">

                            ❌ Cancel

                        </button>

                    </div>

                `;


                bookingList.appendChild(
                    card
                );

            });

    }


    /* PRINT */

    window.printBooking =
        function(id) {

            const bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookings"
                    )
                ) || [];


            const booking =
                bookings.find(
                    function(item) {

                        return item.id === id;

                    }
                );


            if (!booking) {

                return;

            }


            window.location.href =
                "confirmation.html?id=" +
                booking.id;

        };


    /* CANCEL */

    window.cancelBooking =
        function(id) {

            const answer =
                confirm(
                    "Are you sure you want to cancel this booking?"
                );


            if (!answer) {

                return;

            }


            let bookings =
                JSON.parse(
                    localStorage.getItem(
                        "bookings"
                    )
                ) || [];


            bookings =
                bookings.filter(
                    function(item) {

                        return item.id !== id;

                    }
                );


            localStorage.setItem(
                "bookings",
                JSON.stringify(
                    bookings
                )
            );


            displayBookings();

        };

}/* =========================
   ADMIN DASHBOARD
========================= */

const adminBookings =
    document.getElementById(
        "adminBookings"
    );


if (adminBookings) {

    loadAdminDashboard();


    function loadAdminDashboard() {

        const bookings =
            JSON.parse(
                localStorage.getItem(
                    "bookings"
                )
            ) || [];


        /* TOTAL BOOKINGS */

        document.getElementById(
            "totalBookings"
        ).textContent =
            bookings.length;


        /* TOTAL REVENUE */

        let revenue = 0;


        bookings.forEach(
            function(booking) {

                revenue +=
                    Number(
                        booking.fee
                    ) || 0;

            }
        );


        document.getElementById(
            "totalRevenue"
        ).textContent =
            "₹" + revenue;


        /* DISPLAY BOOKINGS */

        if (bookings.length === 0) {

            adminBookings.innerHTML = `

                <p>
                    No bookings available.
                </p>

            `;

            return;

        }


        adminBookings.innerHTML = "";


        bookings
            .slice()
            .reverse()
            .forEach(
                function(booking) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "admin-booking";


                    div.innerHTML = `

                        <strong>
                            🅿️ ${booking.id}
                        </strong>

                        <p>
                            👤 ${booking.name}
                        </p>

                        <p>
                            📍 ${booking.location}
                        </p>

                        <p>
                            🅿️ Slot:
                            ${booking.slot}
                        </p>

                        <p>
                            🚗 Vehicle:
                            ${booking.vehicleNumber}
                        </p>

                        <p>
                            📅 Date:
                            ${booking.date}
                        </p>

                        <p>
                            💰 Fee:
                            ${
                                Number(booking.fee) === 0
                                ? "FREE"
                                : "₹" + booking.fee
                            }
                        </p>

                    `;


                    adminBookings.appendChild(
                        div
                    );

                }
            );

    }

}
/* =========================
   REAL-TIME SLOT STATUS
========================= */

function updateParkingSlots() {

    const slots =
        document.querySelectorAll(".slot");

    if (!slots.length) {
        return;
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const locationKey =
        params.get("location");

    if (
        !locationKey ||
        !parkingData[locationKey]
    ) {
        return;
    }

    const locationName =
        parkingData[locationKey].name;

    const bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];

    const bookedSlots =
        bookings
            .filter(function(booking) {
                return booking.location === locationName;
            })
            .map(function(booking) {
                return booking.slot;
            });

    slots.forEach(function(slot) {

        const slotName =
            slot.textContent.trim();

        if (bookedSlots.includes(slotName)) {

            slot.classList.add("occupied");

            slot.classList.remove("available");

            slot.classList.remove("selected-slot");

            slot.title =
                "This slot is occupied";

        } else {

            slot.classList.add("available");

            slot.classList.remove("occupied");

            slot.title =
                "Available parking slot";
        }

    });
}

updateParkingSlots();
