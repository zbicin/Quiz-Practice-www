var app = {
    tags: {},
    goodAnswersCount: 0,
    totalAnswersCount: 0,

    questions: [],
    currentQuestion: null,
    currentQuestionIndex: -1,

    // Application Constructor
    initialize: function (questions) {
        app.questions = questions;
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function () {
        app.tags.content = document.getElementById("content");
        app.tags.variants = document.getElementById("variants");
        app.tags.nextButton = document.getElementById("nextQuestionButton");
        app.tags.randomButton = document.getElementById("randomQuestionButton");
        app.tags.previousButton = document.getElementById("previousQuestionButton");
        app.tags.ratio = document.getElementById("successRatio");

        app.randomizeQuestion();
        app.UI.updateQuestion();
        app.UI.bindButtons();
    },

    randomizeQuestion: function () {
        var questionIndex = -2;
        do {
            questionIndex = Math.floor((Math.random() * app.questions.length));
        }
        while (questionIndex == app.currentQuestionIndex);

        app.currentQuestionIndex = questionIndex;

        app.updateCurrentQuestion();
    },

    nextQuestion: function () {
        app.currentQuestionIndex++;

        if (app.currentQuestionIndex == app.questions.length) {
            app.currentQuestionIndex = 0;
        }

        app.updateCurrentQuestion();
    },

    previousQuestion: function () {
        app.currentQuestionIndex--;

        if (app.currentQuestionIndex<0) {
            app.currentQuestionIndex = app.questions.length-1;
        }

        app.updateCurrentQuestion();
    },

    updateCurrentQuestion: function() {
        app.currentQuestion = app.questions[app.currentQuestionIndex];
    },

    checkAnswers: function(chosenVariant) {
        if (chosenVariant.getAttribute("data-variantid") == app.currentQuestion.goodVariant) {
            app.UI.markAsGood(chosenVariant);
            app.goodAnswersCount++;
            app.totalAnswersCount++;
        }
        else {
            app.UI.markAsBad(chosenVariant);
            app.UI.markAsGood(app.tags.variants.children[app.currentQuestion.goodVariant]);
            app.totalAnswersCount++;
        }

        app.UI.updateRatio();
        app.UI.unbindVariants();
    },

    UI: {
        clearVariants: function () {
            while (app.tags.variants.firstChild) {
                app.tags.variants.removeChild(app.tags.variants.firstChild);
            }
        },

        addVariant: function (variantid) {
            var letters = ["A) ", "B) ", "C) ", "D) ", "E) "];
            var text = letters[variantid] + app.currentQuestion.variants[variantid];
            var newListElement = document.createElement("li");
            newListElement.appendChild(document.createTextNode(text));
            newListElement.setAttribute("data-variantid", variantid);
            app.tags.variants.appendChild(newListElement);
        },

        updateQuestion: function () {
            app.tags.content.innerHTML = (app.currentQuestionIndex+1) + "/" + app.questions.length + ": " + app.currentQuestion.content;
            
            app.UI.clearVariants();

            for (var i = 0; i < app.currentQuestion.variants.length; i++) {
                app.UI.addVariant(i);
            }

            app.UI.bindVariants();
        },

        bindVariants: function () {
            for (var i = 0; i < app.currentQuestion.variants.length; i++) {
                app.tags.variants.children[i].addEventListener("click", app.UI.variantClick, false);
            }
        },

        variantClick: function () {
            app.UI.unmarkAll();
            app.checkAnswers(this);
        },

        unbindVariants: function() {
            for (var i = 0; i < app.currentQuestion.variants.length; i++) {
                app.tags.variants.children[i].removeEventListener("click", app.UI.variantClick, false);
            }
        },

        markAsGood: function (variantTag) {
            variantTag.classList.add("good");
        },

        markAsBad: function (variantTag) {
            variantTag.classList.add("bad");
        },

        unmarkAll: function () {
            for (var i = 0; i < app.tags.variants.children.length; i++) {
                app.tags.variants.children[i].className = "";
            }
        },

        bindButtons: function () {
            app.tags.nextButton.addEventListener("click", function () {
                app.nextQuestion();
                app.UI.updateQuestion();
            }, false);

            app.tags.randomButton.addEventListener("click", function () {
                app.randomizeQuestion();
                app.UI.updateQuestion();
            }, false);

            app.tags.previousButton.addEventListener("click", function () {
                app.previousQuestion();
                app.UI.updateQuestion();
            }, false);
        },

        updateRatio: function () {
            app.tags.ratio.innerHTML = Math.round(100*app.goodAnswersCount/app.totalAnswersCount) + "% correct answers."
        }
    }
};