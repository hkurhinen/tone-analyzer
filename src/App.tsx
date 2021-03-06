import React, { useEffect, useState } from 'react';
import * as deepai from "deepai";
import './App.css';
import { Button, Tooltip, Typography } from '@material-ui/core';

deepai.setApiKey(process.env.REACT_APP_DEEPAI_APIKEY);
const url = process.env.REACT_APP_TONE_ANALYZER_URL;
const apiKey = process.env.REACT_APP_TONE_ANALYZER_APIKEY;

/**
 * Interface describing single tone item
 */
interface Tone {
  score: number
  tone_id: "anger" | "fear" | "joy" | "sadness" | "analytical" | "confident" | "tentative"
  tone_name: string
}

/**
 * Interface describing sentence analysis result
 */
interface SentenceAnalysisResult {
  sentence_id: number
  text: string
  tones: Tone[]
}

/**
 * Interface for tone analyzer results
 */
interface AnalysisResult {
  document_tone: {
    tones: Tone[]
  },
  sentences_tone: SentenceAnalysisResult[]
}

/**
 * Creates color for tone and changes opacity according to score
 * 
 * @param tone tone id to create the color for
 * @param score score for the tone
 * @returns color as rgba string
 */
const colorForTone = (tone: string, score: number) => {
  switch(tone) {
    case "anger": 
      return `rgba(245, 66, 66, ${score})`;
    case "fear":
      return `rgba(255, 225, 0, ${score})`;
    case "joy":
      return `rgba(60, 255, 0, ${score})`;
    case "sadness":
      return `rgba(77, 77, 77, ${score})`;
    case "analytical":
      return `rgba(0, 255, 251, ${score})`;
    case "confident":
      return `rgba(8, 0, 255, ${score})`;
    case "tentative":
      return `rgba(158, 255, 223, ${score})`;
    default:
      return `rgba(255, 255, 255, 0)`;
  }

}

/**
 * Analyses text using IBM tone analyzer
 * 
 * @param text text to analyze
 * @returns tone analyzer results
 */
const analyseText = async (text: string) => {
  const res = await fetch(`${url}/v3/tone?version=2017-09-21`, {
    body: JSON.stringify({ text }),
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa("apikey:" + apiKey)}`
    },
    method: "POST"
  });

  return res.json();
}

/**
 * Summarizes given text
 * 
 * @param text text to summarize
 * @returns summarized text
 */
const summarizeText = async (text: string) => {
  return await deepai.callStandardApi("summarization", { text });
}

/**
 * Generates more text from given value
 * 
 * @param text text to give as base for generation
 * @returns generated text
 */
const generateText = async (text: string) => {
  return await deepai.callStandardApi("text-generator", { text });
}

/**
 * React component for rendering application
 */
function App() {

  const [text, setText] = useState<string>("");
  const [res, setRes] = useState<AnalysisResult>();

  useEffect(() => {
    if (text && text.length > 10) {
      analyseText(text).then(res => setRes(res));
    }
  }, [text]);

  const overallTone = res && res.document_tone && res.document_tone.tones.length ? res.document_tone.tones[0].tone_name : "";
  const sentenceTones = res && res.sentences_tone && res.sentences_tone.length ? res.sentences_tone : [];
  const sentenceToneItems = sentenceTones.map((item, index) => {
    const tone = item.tones.length ? item.tones[0].tone_id : "unknown";
    const toneName = item.tones.length ? item.tones[0].tone_name: "Unknown";
    const score = item.tones.length ? item.tones[0].score : 1;
    return (
      <Tooltip key={index} title={`${toneName} ${score * 100} %`}>
        <span style={{background: colorForTone(tone, score)}}>{item.text}</span>
      </Tooltip>
    );
    

  })
  return (
    <div className="App">
      <div className="half">
        <div className="toolContainer">
          <Button color="primary" onClick={() => { 
            summarizeText(text)
              .then(res => res.output && setText(res.output));
          }}>Summarize</Button>
          <Button color="primary" onClick={() => { 
            generateText(text)
              .then(res => res.output && setText(res.output));
          }}>Generate</Button>
        </div>
        <textarea value={text} className="textInput" onChange={(e) => setText(e.currentTarget.value)} />
      </div>
      <div className="half">
        <Typography color="primary" variant="h6">{`Overall tone: ${overallTone}`}</Typography>
        <div className="legend">
          {["anger", "fear", "joy", "sadness", "analytical", "confident", "tentative"].map((toneId) => {
            return <div className="legendItem" key={toneId}>
              <span className="colorIndicator" style={{background: colorForTone(toneId, 1)}} />
              <strong>{toneId}</strong>
            </div>
          })}
        </div>
        <div className="sentenceResultContainer">
          {sentenceToneItems}
        </div>
      </div>
    </div>
  );
}

export default App;
