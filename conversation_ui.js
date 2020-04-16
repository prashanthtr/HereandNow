
'use strict';

//const readline = require('readline');
// const readlineInterface = readline.createInterface(process.stdin, process.stdout);

var d = new Date();
var fwindow = 9;
var db = {};

var chatBox = null;

var answer = ""
var last_answer = ""

var selEvent = null;
var subset = []
var next_question = ""
var endOfSession = false

// const fs = require('fs');
// let jsonData = {}

// fs.readFile('database.json', 'utf-8', (err, data) => {
//     if (err) throw err
//     console.log("hello")
//     jsonData = JSON.parse(data)
// });


window.onload = function(){

    chatBox = document.getElementById("chatarea");
    db = JSON.parse(data);

    start();

    //console.log(db)
    //start();
    //usage:
    // readTextFile("database.json", function(text){
    //     db = JSON.parse("[" + text + "]");
    //     start();
    // });

}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

var input = "";
var startQ = "I'm here to help with information about live events. \nLet's find something interesting for you! \nFirst, would you any specific event that you wanna know more about (event handle, group name, workshop name)?\n"


var question_phrases = [
    startQ,
    "Tell me an activity that you did in last few hours (arts, wellbeing, fitness..)?\n",
    "Did it involve other people?\n",
    "Did it involve physical exercise?\n",
    "Are you looking for something happening NOW?",
    "Are you looking for something happening later in the day?",

    "Would you like to check out ___ that is happening in __ right now?\n",
    "In the meantime - ____ is happening\n",
    "As we are talking, X number of people are doing Y? Would you like to check it out\n",
    "Earlier you said about X, would you now be interested in Y?\n",
    "While you are thinking about my last question, would you like to check out ___\n",
    "Would you like to tinker with a musical instruments\n",
];

// "Tell me an activity that you did in last few hours (arts, wellbeing, fitness..)?\n",

var prompts = [
    "Would you like to take part in an activity?\n",
    "Interested in physical exercise?\n",
    "Are you in the mood for listening to an art performance?\n",
];

function getMonthDays( month ){

    switch(month){
    case 1: return 31; break;
    case 2: return 28; break;
    case 3: return 31; break;
    case 4: return 30; break;
    case 5: return 31; break;
    case 6: return 30; break;
    case 7: return 31; break;
    case 8: return 31; break;
    case 9: return 30; break;
    case 10: return 31; break;
    case 11: return 30; break;
    case 12: return 31; break;
    default: return 30; break;
    }

}


function buildDateConstraints( ){

    var d = new Date(); //create new date object
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var date = d.getDate();


    var hours = d.getHours();
    var minutes = d.getMinutes();
    var start_hour_string = ""
    var end_hour_string = ""

    if( hours >= 0 && hours <= 9 ){
        start_hour_string = "0"+ hours+""
    }
    else{
        start_hour_string = hours+"";
    }

    if( month >= 0 && month <= 9 ){
        month = "0"+ month+""
    }
    else{
        month = month+"";
    }


    if( minutes >= 0 && minutes <= 9 ){
        minutes = "0"+ minutes+""
    }
    else{
        minutes = minutes+"";
    }

    if( hours + fwindow >= 0 && hours + fwindow <= 9 ){
        end_hour_string = "0"+ (hours+fwindow)+""
    }
    else if ( hours + fwindow > 23 ){
        start_hour_string =  "00"; //reset to beginning of day
        end_hour_string =  (hours + fwindow)%23 + "";
        date = date + 1;
        if( date >= getMonthDays(month)){
            month = (month + 1)%12;
            date = date%(getMonthDays(month-1));
        }
        else{
            date = date%getMonthDays(month)
        }

    }
    else{
        end_hour_string = (hours+fwindow)+"";
    }

    var start_time = start_hour_string + ":" + minutes + ""
    var end_time = end_hour_string + ":" + minutes + ""

    var dateConstraint =  {}
    dateConstraint.date = date + "/" + month + "/" + year;
    dateConstraint.start_time = start_time
    dateConstraint.end_time = end_time

    console.log(dateConstraint)
    return dateConstraint;
}

function buildUserConstraints( ){
    //second level

}

function getRecommendation( database, constraints ){

    var subset = database.filter( function (el) {

        //console.log(el.date + " "  + el.start_time + " " + constraints.start_time  + " " + constraints.end_time + " " + timeCompare( constraints.start_time, el.start_time, "<=" ) + " " + timeCompare( constraints.end_time, el.start_time, ">=" ) + " " + (el.date == constraints.date))
        //if(el.end_time == "unknown"){

        return el.date == constraints.date
        // && timeCompare( constraints.start_time, el.start_time, "<=" ) &&   timeCompare( constraints.end_time, el.start_time, ">=" )

        //}
    });
    return subset;
}

//wrong date comparisons

//&& el.start_time >= constraints.start_time && el.start_time <= constraints.end_time

// else if (el.end_time == "unknown") {
//     return el.date == constraints.date && el.end_time <= constraints.end_time
// }

//        else{

//     return el.date == constraints.date  && ( (el.start_time >= constraints.start_time && el.end_time <= constraints.end_time) ||  (el.start_time <= constraints.start_time &&  el.end_time <= constraints.end_time) || (el.start_time >= constraints.start_time &&  el.end_time >= constraints.end_time) );

// }


function directMatch( database, id ){

    //with unique event_id - like a hashtag or a
    var subset = database.filter( function (el) {
        return el.event_id == id

    });
    return subset;
}


function start () {

    //global subset
    subset = getRecommendation(db, buildDateConstraints());
    var start_string = ""

    if (subset.length > 0){
        if( subset.length == 1){
            start_string = "There is "  + subset.length +  " live event happening soon! Interested to know more about it?\n"
        }
        else{
            start_string = "There are "  + subset.length +  " live events happening soon! Interested to know more about them?\n"
        }
    }
    else{
        start_string = "Let's find something interesting for you! \nFirst, Are there any specific events that you wanna know more about (event handle, group name, workshop name)?\n"
    }
    //console.log(subset)
    chatBox.innerHTML += start_string + "<br>";
    next_question = start_string;
    answer = "First";
    //askQuestion("First", start_string, subset, null)
}

window.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        if( endOfSession == false){
            console.log("need to process text")
            answer = document.getElementById("chatbox").value;
            console.log("subset" + subset.length)
            askQuestion( answer , next_question, selEvent)
        }
        else{

        }

    }
}, false);


function askQuestion ( answer, question_string, lastSelectedEvent ){

    //var newSubset = getRecommendation(subset, buildDateConstraints());

    //chatBox.innerHTML += question_string + "<br>";

    if( answer == ""){
        //do not do
        //alert("answer cannot be empty");
    }
    else if (answer =="First"){
        //no change
    }
    else{

        let trimmedAns = answer.trim();
        if( trimmedAns == "Q" || trimmedAns == "exit" || trimmedAns == "I am done"){
            //readlineInterface.close();
            //process.stdin.destroy();
        }
        else if( subset.length > 0 &&  directMatch(subset, trimmedAns).length != 0 ){ //returns index, store somewhere
            //handle match
            response3.call(directMatch(subset, trimmedAns));
            chatBox.innerHTML += "Hope you have a good time at the event! <br>"
            chatBox.innerHTML += "Please refresh or come back later to find new events <br>"

            //The chat is over now!
            //console.log("Hope you have a good time at the event!")
            //readlineInterface.close();
            //process.stdin.destroy();
        }
        else if( answer == "interested" || answer == "yes" || answer == "Yes" || answer == "Interested"){ //replace with interest match

            if (subset.length == 0){

                if( lastSelectedEvent == null){
                }
                else{
                    //console.log("Here are the details of the event")
                    //console.log(lastSelectedEvent.synopsis);

                    chatBox.innerHTML += "Here are the details of the event : "
                    //console.log("Here are the details of the event")
                    chatBox.innerHTML += "<i> <p class=pclass> " + lastSelectedEvent.synopsis + " </p> </i> <br>"

                    chatBox.innerHTML += "Hope you have a good time at the event! <br>"
                    chatBox.innerHTML += "The chat is over now! Please refresh or come back later to find new events <br>"

                    endOfSession = true

                    //console.log("Great! Hope you have a good time at the event!")
                    //console.log("Hope you have a good time at the event!")
                }
                //readlineInterface.close();
                //process.stdin.destroy();
            }
            if( subset.length == 1 ){

                if( lastSelectedEvent == null){
                    response.call(subset[0]);

                    chatBox.innerHTML += "Here are the details of the event : "
                    //console.log("Here are the details of the event")
                    chatBox.innerHTML += "<i>  <p class=pclass>" + subset[0].synopsis + " </p> </i> <br>"
                    //console.log(subset[0].synopsis);
                    console.log("Great! Hope you have a good time at the event!")

                    chatBox.innerHTML += "Hope you have a good time at the event! <br>"
                    chatBox.innerHTML += "We couldn't find any more live events happening now! Please refresh or come back later to find new events <br>"

                    endOfSession = true
                    //readlineInterface.close();
                    //process.stdin.destroy();
                }
                else{
                    //console.log("Here are the details of the event")
                    //console.log(lastSelectedEvent.synopsis );

                    chatBox.innerHTML += "Here are the details of the event : "
                    chatBox.innerHTML += "<i> <p class=pclass> " + lastSelectedEvent.synopsis + " </p> </i> <br>"

                    selEvent = subset[0];
                    subset = skipN(subset, 0)
                    //redundantly displaying synopsis
                    //console.log(selEvent)
                    //last_answer = answer;
                    next_question = "Is this good or are you interested to know about the other event? "
                    //subset = newArr;
                    answer = ""
                    chatBox.innerHTML += next_question + "<br>"
                    //askQuestion(answer, next_question, subset, selEvent);
                }

            }
            else if( subset.length > 1){
                //keeps generating suggestions until it becomes one - needs to weed out some similar elements

                var dbnum = Math.floor( Math.random()* subset.length );
                console.log("Here are the details of the event")
                if( lastSelectedEvent == null ){
                    response2.call(subset[dbnum]);
                }
                else{
                    chatBox.innerHTML += "Here are the details of the event : "
                    chatBox.innerHTML += "<i> <p class=pclass> " + lastSelectedEvent.synopsis + " </p> </i> <br>"
                    //console.log(lastSelectedEvent.synopsis);
                }

                selEvent = subset[dbnum];
                subset = skipN(subset, dbnum)
                //redundantly displaying synopsis
                //last_answer = answer;
                //subset = newArr;
                next_question = "Interested or looking for something different?";

                answer = ""
                chatBox.innerHTML += next_question + "<br>"
                //askQuestion(answer, next_question, subset, selEvent);
                //askQuestion("Interested or looking for something different? ", newArr, selEvent);
            }
        }
        else if( answer == "different" || answer == "something different" || answer == "no" || answer == "No" || answer == "good" || answer == "Good"){

            //for is this good?

            if( subset.length == 1 ){
                response.call(subset[0]);
                selEvent = subset[0];
                subset = skipN(subset, 0)
                //last_answer = answer;
                //subset = newArr;
                next_question = "Interested";
                chatBox.innerHTML += next_question + "<br>"
                //askQuestion("Interested?", newArr, selEvent);
            }
            else if( subset.length > 1){
                var dbnum = Math.floor( Math.random()* subset.length );
                selEvent = subset[dbnum];
                response2.call(subset[dbnum]);
                //console.log(subset.length)
                subset = skipN(subset, dbnum)
                //subset = newArr;
                //console.log(newArr.length)
                //last_answer = answer;
                next_question = "Interested or looking for something different?";
                answer = ""
                chatBox.innerHTML += next_question + "<br>"
                //askQuestion(answer, next_question, subset, selEvent);

                //askQuestion("Interested or looking for something different? ", newArr, selEvent);
            }
            else{
                chatBox.innerHTML += "Hope you have a good time at the event! <br>"
                chatBox.innerHTML += "Please come back later for more events! <br>"
                console.log("Please come back to check if there are any events!")
                endOfSession = true
                //readlineInterface.close();
                //process.stdin.destroy();

                //start(); //all over again, or actually with current user preferences (and not system date preference)
            }

        }
        else{
            //no subsets
            chatBox.innerHTML +=  " Dont think I understood your response. Please try again! "
            //console.log(" Dont think I understood your response. Please try again! ")
            //var nextQNum = 1 + Math.floor( Math.random()* (question_phrases.length-1) );
            //last_answer = answer+Date.now();
            //no change
            //askQuestion(question_string, subset);
            //start();

        }


    }

    //var answer = prompt(question_string);

    // readlineInterface.question( question_string, function(answer){


    //console.log(" This is not a conversation yet : ", answer)
    //console.log(" continuing interaction " )

    //var nextQNum = 1 + Math.floor( Math.random()* (question_phrases.length-1) ); //Do not have to include the first question again
    // if( isEmpty(db) ){

    // }

    //else{

    // }

    //right now, build a newDate constraint as time is ticking
    // var dC = buildDateConstraints();
    // console.log(dC);
    // var recomm = getRecommendation( db, dC );
    // askQuestion(question_phrases[nextQNum], recomm);

    //});
}

// yes/no, not really
//askQuestion(0);

// readlineInterface.on('close', function() {
//   console.log('goodbye!');
//   process.exit(0);
// });


//skip the
function skipN ( arr, n ){

    var newArr= []
    var iter = 0
    while( iter < n-1){
        newArr.push(arr.shift());
        iter++
    }

    iter= 1; //skip
    while( iter < arr.length){
        newArr.push(arr[iter]); iter++;
    }

    return newArr;
}

//Using call to invoke a function and specifying the context for 'this'
function question (){

    var reply_phrases = [];
    const reply = ["Would like to check out the event ", this.event_name, " is happening on ", this.date + " from " + this.start_time + (this.end_time=="uknown"?"":(" to " + this.end_time))].join("");
    chatBox.innerHTML += reply + "<br>"
    //console.log(reply);
}

//Using call to invoke a function and specifying the context for 'this'
function response2 (){

    var reply_phrases = [];
    const reply = ["We found an event for you. The event ", this.event_name, " is happening on ", this.date + " from " + this.start_time + (this.end_time=="uknown"?".":(" to " + this.end_time))].join("");
    chatBox.innerHTML += reply + "<br>"
    console.log(reply);
}

//Using call to invoke a function and specifying the context for 'this'
function response3 (){

    var reply_phrases = [];
    const reply = ["We found an event that you were looking for! The event ", this.event_name, " is happening on ", this.date + " from " + this.start_time + (this.end_time=="uknown"?".":(" to " + this.end_time))].join("");
    chatBox.innerHTML += reply + "<br>"
    //console.log(reply);
}


//Using call to invoke a function and specifying the context for 'this'
function response (){

    var reply_phrases = [];
    const reply = ["Would like to check out the event ", this.event_name, " is happening on ", this.date + " from " + this.start_time + (this.end_time=="uknown"?"":(" to " + this.end_time))].join("");
    chatBox.innerHTML += reply + "<br>"
    //console.log(reply);
}


function timeCompare ( src, tar, evaluator ){

    var srcTime = src.split(":")
    var tarTime = tar.split(":")

    if( srcTime[0] == tarTime[0]  ){ //hours are same
        if ( eval(parseInt(srcTime[1]) + evaluator + parseInt(tarTime[1])) ){ //
            return true
        }
        else{
            return false
        }
    }
    else if( eval(parseInt(srcTime[0]) + evaluator + parseInt(tarTime[0])) ){
        return true
    }
    else{
        return false
    }

}
