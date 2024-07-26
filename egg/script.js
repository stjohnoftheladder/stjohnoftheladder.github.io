const dialogues = [
    { character: 'Senior Demon', text: 'So, you have more temptations for a human soul to pitch to me?' },
    { character: 'Junior Tempter', text: 'Yes, sir, I do. It’s going to be super easy, barely an inconvenience.' },
    { character: 'Senior Demon', text: 'Oh, really?' },
    { character: 'Junior Tempter', text: 'Yeah, this guy is already pretty proud, so I thought we’d start there.' },
    { character: 'Senior Demon', text: 'Pride, huh? How are we going to magnify that?' },
    { character: 'Junior Tempter', text: 'Well, we’ll make him believe he’s always right and his opinions are superior to everyone else’s.' },
    { character: 'Senior Demon', text: 'Wow, wow, wow. Wow. So, he’ll be super arrogant?' },
    { character: 'Junior Tempter', text: 'Oh, very arrogant. He’ll dismiss anyone who disagrees with him or questions his views.' },
    { character: 'Senior Demon', text: 'That’s good. And how do you get him to justify this?' },
    { character: 'Junior Tempter', text: 'Easy, we’ll make him think his intelligence and accomplishments entitle him to be condescending.' },
    { character: 'Senior Demon', text: 'Nice! That way he’ll keep making the same mistakes.' },
    { character: 'Junior Tempter', text: 'Exactly. And as a bonus, we can make him really impatient with people who he thinks are less intelligent than him.' },
    { character: 'Senior Demon', text: 'Perfect! How do you plan to keep him from realizing he’s being prideful?' },
    { character: 'Junior Tempter', text: 'We’ll just have him call it “confidence” and make him think humility is a sign of weakness.' },
    { character: 'Senior Demon', text: 'Brilliant. What else do you have?' },
    { character: 'Junior Tempter', text: 'Well, he’s also materialistic but thinks he’s not, so I thought we’d keep him obsessed with money and status.' },
    { character: 'Senior Demon', text: 'Oh, nice. How are we going to do that?' },
    { character: 'Junior Tempter', text: 'We’ll make him believe his worth is tied to his possessions and how successful he appears to others.' },
    { character: 'Senior Demon', text: 'That’s fantastic. How do we keep him from finding real fulfillment?' },
    { character: 'Junior Tempter', text: 'Simple, we’ll distract him with endless desires for more. More money, more praise, more worldly things—you name it. It’ll never be enough.' },
    { character: 'Senior Demon', text: 'Wow, that’s diabolical. Keep it up and soon enough, this soul will be ours.' },
    { character: 'Junior Tempter', text: 'Thanks, sir. I won’t let you down.' }
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
