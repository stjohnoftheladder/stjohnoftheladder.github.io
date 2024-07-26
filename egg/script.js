const dialogues = [
    { character: 'Senior Angel', text: 'So, you have more virtues for a human soul to instill in them?' },
{ character: 'Junior Guardian', text: 'Yes, sir, I do. It’s going to be super easy, barely an inconvenience.' },
{ character: 'Senior Angel', text: 'Oh, really?' },
{ character: 'Junior Guardian', text: 'Yeah, this person is already quite humble, so I thought we’d build on that.' },
{ character: 'Senior Angel', text: 'Humility, huh? How are we going to enhance that?' },
{ character: 'Junior Guardian', text: 'Well, we’ll encourage them to value others’ opinions and recognize the worth in everyone.' },
{ character: 'Senior Angel', text: 'Wow, wow, wow. Wow. So, they’ll be exceptionally considerate?' },
{ character: 'Junior Guardian', text: 'Oh, very considerate. They’ll seek to understand others and respect differing viewpoints.' },
{ character: 'Senior Angel', text: 'That’s good. And how do you get them to maintain this?' },
{ character: 'Junior Guardian', text: 'Easy, we’ll inspire them to see their intelligence and accomplishments as tools for service.' },
{ character: 'Senior Angel', text: 'Nice! That way they’ll continue to grow and help others do the same.' },
{ character: 'Junior Guardian', text: 'Exactly. And as a bonus, we can cultivate their patience and empathy, especially towards those they might initially misunderstand.' },
{ character: 'Senior Angel', text: 'Perfect! How do you plan to keep them aware of the trap of pride?' },
{ character: 'Junior Guardian', text: 'We’ll nurture true confidence in them and remind them that humility is actually a sign of strength.' },
{ character: 'Senior Angel', text: 'Brilliant. What else do you have?' },
{ character: 'Junior Guardian', text: 'Well, they are slightly materialistic but are open to change, so I thought we’d help them find joy in simplicity.' },
{ character: 'Senior Angel', text: 'Oh, nice. How are we going to do that?' },
{ character: 'Junior Guardian', text: 'We’ll guide them to understand that their worth is not tied to their possessions or how others see them.' },
{ character: 'Senior Angel', text: 'That’s fantastic. How do we help them find real fulfillment?' },
{ character: 'Junior Guardian', text: 'Simple, we’ll lead them to cherish spiritual riches and inner peace. More love, more service, more heavenly joys—you name it. It’ll be deeply fulfilling.' },
{ character: 'Senior Angel', text: 'Wow, that’s divine. Keep it up and soon enough, this soul will radiate light.' },
{ character: 'Junior Guardian', text: 'Thanks, sir. I won’t let you down.' }

];

let currentDialogueIndex = 0;
let isWaiting = false;

const openingScreen = document.getElementById('opening-screen');
const dialogueContainer = document.getElementById('dialogue-container');
const dialogueTextElement = document.getElementById('dialogue-text');
const nextButton = document.getElementById('next-button');
const exitButton = document.getElementById('exit-button');
const exitButtons = document.querySelectorAll('.exit-button');
const juniorTempterImage = document.getElementById('junior-tempter');
const seniorDemonImage = document.getElementById('senior-demon');

function updateDialogue() {
    const currentDialogue = dialogues[currentDialogueIndex];
    dialogueTextElement.textContent = '';
    isWaiting = true;

    setTimeout(() => {
        dialogueTextElement.textContent = currentDialogue.text;
        isWaiting = false;
    }, 300); // Delay of 1000ms (1 second)

    if (currentDialogue.character === 'Junior Tempter') {
        juniorTempterImage.style.opacity = 1;
        seniorDemonImage.style.opacity = 0.2;
    } else if (currentDialogue.character === 'Senior Demon') {
        juniorTempterImage.style.opacity = 0.2;
        seniorDemonImage.style.opacity = 1;
    }
}

nextButton.addEventListener('click', () => {
    if (!isWaiting) {
        currentDialogueIndex++;
        if (currentDialogueIndex < dialogues.length) {
            updateDialogue();
        } else {
            nextButton.style.display = 'none';
            exitButton.style.display = 'inline-block';
        }
    }
});

exitButton.addEventListener('click', () => {
    window.close(); // attempt to close the window
    // window.location.href = 'some_other_page.html';
});

exitButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.close();
    });
});

openingScreen.addEventListener('click', () => {
    openingScreen.style.display = 'none';
    dialogueContainer.style.display = 'block';
    updateDialogue();
});

// Initialize the first dialogue
updateDialogue();
