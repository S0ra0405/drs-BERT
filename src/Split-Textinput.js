function splitParagraph(parag){
    clearElements('sentences-array');
    let re = /\. |。|．|$|\n/;
    let sentences = parag.split(re);
    sentences.pop();
    for(let i=0; i<sentences.length; i++){
       sentences[i] = (i+1)+'\n'+sentences[i]; 
    }
    appendSentences(sentences);
}