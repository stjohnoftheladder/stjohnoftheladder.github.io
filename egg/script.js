const dialogues = [
    { character: 'Senior Demon', text: 'So, you have some more temptations for a human soul to pitch to me?' },
    { character: 'Junior Tempter', text: 'Yes, sir, I do. It’s going to be super easy, barely an inconvenience.' },
    { character: 'Senior Demon', text: 'Oh, really?' },
    { character: 'Junior Tempter', text: 'Yeah, this guy is already pretty susceptible to pride, so I thought we’d start there.' },
    { character: 'Senior Demon', text: 'Pride, huh? How are we going to magnify that?' },
    { character: 'Junior Tempter', text: 'Well, we’ll make him believe he’s always right and his opinions are superior to everyone else’s.' },
    { character: 'Senior Demon', text: 'Wow, wow, wow. Wow. So, he’ll be super arrogant?' },
    { character: 'Junior Tempter', text: 'Oh, very arrogant. He’ll dismiss anyone who disagrees with him and surround himself with people who only reinforce his views.' },
    { character: 'Senior Demon', text: 'That’s good. And how do you get him to justify this behavior?' },
    { character: 'Junior Tempter', text: 'Easy, we’ll make him think his intelligence and accomplishments entitle him to be condescending.' },
    { character: 'Senior Demon', text: 'Nice! That way he’ll never listen to constructive criticism and keep making the same mistakes.' },
    { character: 'Junior Tempter', text: 'Exactly. And as a bonus, we can make him really impatient with people who he thinks are less intelligent than him.' },
    { character: 'Senior Demon', text: 'Perfect! How do you plan to keep him from realizing he’s being prideful?' },
    { character: 'Junior Tempter', text: 'We’ll just have him call it “confidence” and make him think humility is a sign of weakness.' },
    { character: 'Senior Demon', text: 'Brilliant. What else do you have?' },
    { character: 'Junior Tempter', text: 'Well, he’s also materialistic but thinks he’s not, so I thought we’d keep him obsessed with wealth and status.' },
    { character: 'Senior Demon', text: 'Oh, nice. How are we going to do that?' },
    { character: 'Junior Tempter', text: 'We’ll make him believe his value and happiness are tied to how much he owns and how successful he appears to others.' },
    { character: 'Senior Demon', text: 'That’s fantastic. How do we keep him from finding fulfillment in anything else?' },
    { character: 'Junior Tempter', text: 'Simple, we’ll distract him with constant desires for more. More money, more praise, more entertainment—you name it.' },
    { character: 'Senior Demon', text: 'Wow, that’s diabolical. What about relationships?' },
    { character: 'Junior Tempter', text: 'We’ll encourage him to form shallow relationships based on what people can do for him rather than genuine connection.' },
    { character: 'Senior Demon', text: 'Oh, so very practical.' },
    { character: 'Junior Tempter', text: 'Super practical.' },
	{ character: 'Senior Demon', text: 'You’ve done a great job here. Keep it up and soon enough, this human soul will be ours.' },
    { character: 'Junior Tempter', text: 'Thanks, sir. I won’t let you down.' }
];

let currentDialogueIndex = 0;
let isWaiting = false;

const openingScreen = document.getElementById('opening-screen');
const dialogueContainer = document.getElementById('dialogue-container');
const dialogueTextElement = document.getElementById('dialogue-text');
const nextButton = document.getElementById('next-button');
const exitButton = document.getElementById('exit-button');
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

openingScreen.addEventListener('click', () => {
    openingScreen.style.display = 'none';
    dialogueContainer.style.display = 'block';
    updateDialogue();
});

// Initialize the first dialogue
updateDialogue();
