controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Objectives.completeQuest("Kick Jerry in the face")
})
Objectives.onQuestCompleted("Kick Jerry in the face", function () {
    info.changeScoreBy(1)
    Objectives.hideQuest()
})
Objectives.drawQuest("Kick Jerry in the face")
