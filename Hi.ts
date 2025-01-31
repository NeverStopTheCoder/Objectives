// Add your code here
//%icon=""
//%color=#28a745
//%weight=95
namespace Objectives{
    // Variable to store the quest name and completion status
    let currentQuest: string = "";
    let questCompleted = false;
    let color = 1
    let questCompletedHandlers: { name: string, handler: () => void }[] = []; // Stores handlers for quests

    // Function to draw the quest with a checkbox
    //% block="Draw quest $questName"
    export function drawQuest(questName: string): void {
        currentQuest = questName;
        questCompleted = false;  // Reset the checkbox to unchecked

        game.onPaint(function () {
            const startX = 20;  // X position for text
            const boxX = 5;  // X position for the checkbox
            const boxSize = 8;  // Size of the checkbox
            const yPosition = screen.height / 2;  // Y position in the middle of the screen

            // Draw checkbox
            screen.drawRect(boxX, yPosition, boxSize, boxSize, color);
            if (questCompleted) {
                screen.fillRect(boxX + 2, yPosition + 2, boxSize - 4, boxSize - 4, 1);
            }

            // Draw quest text with wrapping
            let textHeight = wrapAndDrawText(currentQuest, startX, yPosition, 120);
        });

        // Function to wrap and draw text
        function wrapAndDrawText(text: string, x: number, y: number, wrapWidth: number): number {
            let words = text.split(" ");
            let currentLine = "";
            let currentY = y;
            const lineHeight = 12;
            let totalHeight = lineHeight;

            for (const word of words) {
                let testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
                if (testLine.length * 13 > wrapWidth) {
                    screen.print(currentLine, x, currentY);
                    currentLine = word;
                    currentY += lineHeight;
                    totalHeight += lineHeight;
                } else {
                    currentLine = testLine;
                }
            }
            screen.print(currentLine, x, currentY);
            return totalHeight;
        }
    }

    // Function to mark the quest as completed (fills in the checkbox)
    //% block="Complete quest $questName"
    export function completeQuest(questName: string): void {
        if (currentQuest === questName && !questCompleted) { // Only complete if it isn't already completed
            questCompleted = true;  // Mark the quest as completed

            // Call all registered handlers for this quest and remove them after running
            questCompletedHandlers = questCompletedHandlers.filter(q => {
                if (q.name === questName) {
                    q.handler(); // Run the handler
                    return false; // Remove from list after running
                }
                return true;
            });
        }
    }

    // Function to register an event when a quest is completed
    //% block="On quest completed $questName"
    //% questName.shadow="text"
    export function onQuestCompleted(questName: string, handler: () => void): void {
        // If the quest is already completed, run the handler immediately
        if (currentQuest === questName && questCompleted) {
            handler();
        } else {
            // Otherwise, store it to be called when the quest is completed
            questCompletedHandlers.push({ name: questName, handler: handler });
        }
    }
    // Function to hide the quest after a short delay
    //% block="Hide quest"
    export function hideQuest(): void {
        pause(600); // Wait 2 seconds before hiding the quest

        currentQuest = "";  // Clear the quest name
        questCompleted = false;  // Reset the checkbox
        color = 0

        // Stop drawing the quest by removing the onPaint function
        game.onPaint(() => { });
    }
}
