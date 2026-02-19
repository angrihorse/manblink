when user goes to / app
1. select prompts
like in tinder onobarding
list as selectable items[party][hike][cooking][volleyball][tennis][football][gym][dog][cat][wedding][cafe][city][park][+Write your own]
1a.Write your own button -> enter a title and a prompt[from image]-> [save]. [from image]-> upload image -> generates prompt from the image
2. upload photo - same component like i have on my main page
[update] - gray[get photos]- main color - buttons in a row below image.this screen is h - dvh with no scroll
3.  call generate api.show timer 0: 59 - count down - h - dvh.listen to firestore collection 'photos' - update realtime once that collection gets new items
4. once I have at least 1 item showing.each photo has 4 buttons
[x - discard][() - Retry][download] - as icons
discard sets photo status to discarded - which gets filtered out by collection
Retry - sets status to retry - hides from list-- adds new photo to the bottom of the list with label 'retry' - icon not word
download - sets status to saved - hides from list
    in the end the list should be empty
below the list are 2 buttons
[history - gray][Get more - accent] 
History opens up the view of all generations by user
list1 - liked { downloaded }
list2 - disliked { discarded, retry }
Get more goes back to the 2 screen

backend:
1. prompts are saved in writable
2. 
user doc has avatars - array of photoIds - which are his selfies
user doc has activeAvatar - photoId
storage has photos / { photoId }
3. call to generate - subtract credits from user doc
create new photo doc in photos collection with userId, createdAt, promptId, inputPhotoId, outputPhotoId
add prompt to prompts collection: text, createdAt, userId, parentId - id of the parent prompt
4. listen to photos added to collection where userId == current user and status in ['new', 'retry']
if some photos are still new when I click more - discard
if photos is retry - it gets parentId - doc id of the original photo
download button - sets status to saved

help with:
i need some ui to show credit balance - and credits used for current session
or how many they have left

design:
try to be as consistent as possible with the design I already use in my landing page and authForm and PhotoRow and PhotoUpload
by that I mean dont use new tailwind classes for new fonts colors or spacings-- only the ones I already have

use functions from here for photo upload - but my different db schema
    < script lang = "ts" >
  import AuthCheck from "$lib/components/AuthCheck.svelte";
import { user, userData, storage, db } from "$lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

let previewURL: string = $state();
let uploading = $state(false);
let href = $derived(`/${$userData?.username}/edit`);

async function upload(e: any) {
    uploading = true;
    const file = e.target.files[0];
    previewURL = URL.createObjectURL(file);
    const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
    const result = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(result.ref);

    await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
    uploading = false;
}
</script >

    <AuthCheck>
        <h2 class="card-title">Upload a Profile Photo</h2>

        <form class="max-w-screen-md w-full">
            <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
                <img
                    src={previewURL ?? $userData?.photoURL ?? "/user.png"}
                    alt="photoURL"
                    width="256"
                    height="256"
                    class="mx-auto"
                />
                <label for="photoURL" class="label">
                    <span class="label-text">Pick a file</span>
                </label>
                <input
                    onchange={upload}
                    name="photoURL"
                    type="file"
                    class="file-input file-input-bordered w-full max-w-xs"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                />
                {#if uploading}
                <p>Uploading...</p>
                <progress class="progress progress-info w-56 mt-6"></progress>
                {/if}
            </div>
        </form>

        <a {href} class="btn btn-primary"> Finish </a>
    </AuthCheck>

below is official example by google gen ai-- I want to use it
// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
import { text } from "stream/consumers"

function saveBinaryFile(fileName: string, content: Buffer) {
    writeFile(fileName, content, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file ${fileName}:`, err);
            return;
        }
        console.log(`File ${fileName} saved to file system.`);
    });
}

async function main() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const tools = [
        {
            googleSearch: {
            }
        },
    ];
    const config = {
        responseModalities: [
            'IMAGE',
            'TEXT',
        ],
        imageConfig: {
            imageSize: '1K',
        },
        tools,
    };
    const model = 'gemini-3-pro-image-preview';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `INSERT_INPUT_HERE`,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    let fileIndex = 0;
    for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
        }
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const fileExtension = mime.getExtension(inlineData.mimeType || '');
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
        }
        else {
            console.log(chunk.text);
        }
    }
}

main();

prompt me on the implementation before you write any code