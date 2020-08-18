import moment from 'moment';

// Given a Pharmacy schedule, it returns a structured schedule, if it is open now
// and the day of the week
const ParseSchedule = (res) => {

    try {
        const s = res[0];
        const mon = [s.mon_start_am, s.mon_end_am, s.mon_start_pm, s.mon_end_pm];
        const tue = [s.tue_start_am, s.tue_end_am, s.tue_start_pm, s.tue_end_pm];
        const wed = [s.wed_start_am, s.wed_end_am, s.wed_start_pm, s.wed_end_pm];
        const thu = [s.thu_start_am, s.thu_end_am, s.thu_start_pm, s.thu_end_pm];
        const fri = [s.fri_start_am, s.fri_end_am, s.fri_start_pm, s.fri_end_pm];
        const sat = [s.sat_start_am, s.sat_end_am, s.sat_start_pm, s.sat_end_pm];
        const sun = [s.sun_start_am, s.sun_end_am, s.sun_start_pm, s.sun_end_pm];
        const week = mon.concat(tue, wed, thu, fri, sat, sun);
        const weekday = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        let result = [];
        let isOpen = false;
        let n = 0;
        const parseTime = (timeString: string) => moment(timeString, 'HH:mm');

        const now = moment(new Date(), 'HH:mm');
        // Instead of (0: Sunday, 1: Monday..) => (1: Monday, 2: Tuesday..)
        let day = new Date().getDay() - 1;
        if (day < 0) { day = 6; }

        for (let i = 0; i < 7; i++) {
            // Closed
            if (week[n] == null && week[n + 2] == null) { result.push(`${weekday[i]} closed`); }
            // Full day without split
            else if (week[n] !== null && week[n + 1] == null) {
                const startTime = week[n].slice(0, 5);
                const endTime = week[n + 3].slice(0, 5);
                result.push(`${weekday[i]} ${startTime} - ${endTime}`);
                // eslint-disable-next-line eqeqeq
                if (parseTime(startTime).isBefore(now) && parseTime(endTime).isAfter(now) && day == i) { isOpen = true; }
            }
            // Morning
            else if (week[n] !== null && week[n + 2] == null) {
                const startTime = week[n].slice(0, 5);
                const endTime = week[n + 1].slice(0, 5);
                result.push(`${weekday[i]} ${week[n].slice(0, 5)} - ${week[n + 1].slice(0, 5)}`);
                if (parseTime(startTime).isBefore(now) && parseTime(endTime).isAfter(now) && day === i) { isOpen = true; }
            }
            // Afternoon
            else if (week[n] == null && week[n + 2] !== null) {
                const startTime = week[n + 2].slice(0, 5);
                const endTime = week[n + 3].slice(0, 5);
                result.push(`${weekday[i]} ${week[n + 2].slice(0, 5)} - ${week[n + 3].slice(0, 5)}`);
                if (parseTime(startTime).isBefore(now) && parseTime(endTime).isAfter(now) && day === i) { isOpen = true; }
            }
            // Full day with split
            else {
                const startTimeAM = week[n].slice(0, 5);
                const endTimeAM = week[n + 1].slice(0, 5);
                const startTimePM = week[n + 2].slice(0, 5);
                const endTimePM = week[n + 3].slice(0, 5);
                result.push(`${weekday[i]} ${startTimeAM} - ${endTimeAM} , ${startTimePM} - ${endTimePM}`);
                if ((parseTime(startTimeAM).isBefore(now) && parseTime(endTimeAM).isAfter(now) && day === i) ||
                    (parseTime(startTimePM).isBefore(now) && parseTime(endTimePM).isAfter(now) && day === i)) { isOpen = true; }
            }
            n = n + 4;
        }
        //return [result, isOpen, day];
        return {
            result: result,
            isOpen: isOpen,
            day: day,
        };
    } catch (err) {
        console.log('Error on PharmacySchedule.js -> parseSchedule() : ', err);
    }
};

export default ParseSchedule;
