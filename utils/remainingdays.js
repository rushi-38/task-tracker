function getRemainingDays(dueDate, status) {

    if (status === "Completed") {

        return "Completed";

    }

    const today =
    new Date();

    const due =
    new Date(dueDate);

    today.setHours(0,0,0,0);

    due.setHours(0,0,0,0);

    const diff =
    due - today;

    const days =
    Math.ceil(
        diff /
        (1000 * 60 * 60 * 24)
    );

    if (days > 0) {

        return `${days} Days Left`;

    }

    else if (days === 0) {

        return "Due Today";

    }

    else {

        return `Overdue By ${Math.abs(days)} Days`;

    }

}

module.exports =
getRemainingDays;