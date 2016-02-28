console.log('Homework 2-A...');

d3.csv('data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows) {

    //console.log(rows);
    var allTrips = crossfilter(rows);
    //var tripsByAge = allTrips.dimension(function(d){return d.userAge});
    var tripsByYear = allTrips.dimension(function (d) {
        return d.startTime.getFullYear();
    });
    var tripsByGender = allTrips.dimension(function (d) {
        return d.gender;
    });
    var tripsBySubscriberType = allTrips.dimension(function (d) {
        return d.subscriber;
    });
    var tripsByStartStation = allTrips.dimension(function (d) {
        return d.startStation;
    });
    var tripsByDuration = allTrips.dimension(function (d) {
        return d.duration;
    });

    //total number of trips in 2012
    tripsByYear.filter(2012);
    console.log('tripsByYear.top(Infinity).length');
    console.log(tripsByYear.top(Infinity).length);

    //total number of trips in 2012 AND taken by male, registered users
    tripsByGender.filter("Male");
    console.log('tripsByGender.top(Infinity).length');
    console.log(tripsByGender.top(Infinity).length);

    //total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5). Note that when you apply a new filter on column/dimension A, the existing filters are columns B, C, D... etc. are still active
    tripsByGender.filter(null);
    tripsByStartStation.filter("5");
    console.log('tripsByStartStation.top(Infinity).length');
    console.log(tripsByStartStation.top(Infinity).length);

    //top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration. Log the array of these trips in console.
    tripsByYear.filter(null);
    tripsByGender.filter(null);
    tripsByStartStation.filter(null);
    console.log('tripsByDuration.top(50)');
    console.log(tripsByDuration.top(50));

    //Afterwards, clear all filters.
    tripsByYear.filter(null);
    tripsByGender.filter(null);
    tripsByStartStation.filter(null);

    //group all trips into 10-year age buckets i.e. trips by users between 20 and 29, 30 and 39 etc.
    var tripsByAge = allTrips.dimension(function (d) {
        return d.age;
    });
    var tripsByAgeGroup = tripsByAge.group(function (d) {
        return Math.floor(d/10);
    });

    //Console log these groups using group.all()
    console.log('tripsByAgeGroup.all()');
    console.log(tripsByAgeGroup.all());
}
function parse(d){
    if(+d.duration<0) return;
    var gender = d.gender==""?"-1": d.gender;
    var age = d.birth_date==""?"-1": 2016 - (+d.birth_date);

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        seq: +d.seq_id,
        id: +d.hubway_id,
        status: d.status,
        bike: d.bike_nr,
        subscriber: d.subsc_type,
        zip: d.zip_code.slice(1),
        age: age,
        gender: gender
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
};

