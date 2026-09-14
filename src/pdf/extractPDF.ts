import * as pdfjsLib from "pdfjs-dist"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

async function blobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            const result = reader.result as string
            resolve(result.split(",")[1])
        }

        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

export async function extractPDFText(file: File) { 

    const arrayBuffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
    }).promise
    let text = ""

    for (let pageNumber = 0; pageNumber < pdf.numPages; pageNumber++){
        const page = await pdf.getPage(pageNumber + 1)

        const textContent = await page.getTextContent()

        for (const item of textContent.items) {
            if ("str" in item) {
                text += item.str + " "
            }
        }

        text += "\n"
    }
    return text
}

export async function extractPDFImages(file: File) {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
    }).promise;

    const images = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const operatorList = await page.getOperatorList();

        for (let i = 0; i < operatorList.fnArray.length; i++) {
            const operation = operatorList.fnArray[i];
            const args = operatorList.argsArray[i];

            if (operation === pdfjsLib.OPS.paintImageXObject) {
                const imageId = args[0];

                const image = await new Promise<any>((resolve) => {
                    page.objs.get(imageId, resolve);
                });
                const canvas = document.createElement("canvas")

                canvas.width = image.width
                canvas.height = image.height

                const context = canvas.getContext("2d")

                if (!context) {
                    throw new Error("Could not create canvs content")
                }

                context.drawImage(image.bitmap, 0, 0)

                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob(resolve, "image/png")
                })

                if (!blob) {
                    continue
                }

                const base64 = await blobToBase64(blob)

                const imageResult = {
                    inlineData: {
                        data: base64,
                        mimeType: "image/png"
                    }
                }

                images.push(imageResult)
            }
        }
    }
     return images
}