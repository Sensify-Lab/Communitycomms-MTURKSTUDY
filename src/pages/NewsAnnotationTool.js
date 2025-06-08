import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import Papa from "papaparse";

import { database, ref, push } from "../firebaseConfig";

const DropdownItem = ({ icon, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
      <div className="mb-1">
          <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full text-left text-sm font-bold text-gray-800 hover:text-blue-600 focus:outline-none"
          >
              <span>{icon} {title}</span>
              <span>{isOpen ? "−" : "+"}</span>
          </button>
          {isOpen && (
              <div className="mt-1 ml-4 text-xs text-gray-700 transition-all duration-200">
                  {children}
              </div>
          )}
      </div>
  );
};

// Function to shuffle array randomly
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };
/*
    const sampleArticles = [
        {
          id: 1,
          title: "Global Markets in Turmoil as Stocks Tumble",
          content: "The global stock markets experienced a sharp downturn today as economic uncertainty and fears of recession loomed large. Investors reacted to the latest inflation data, which showed a continued rise in consumer prices, leading to a sell-off in major indices. The Dow Jones Industrial Average dropped over 500 points, while the Nasdaq Composite plunged 2.8%. Market analysts cited concerns over interest rate hikes and geopolitical tensions as key factors behind the decline..."
        },
        {
          id: 2,
          title: "Government Announces Sweeping Climate Policy Reforms",
          content: "In a landmark decision, the government unveiled a series of new climate policy reforms aimed at reducing carbon emissions by 40% over the next decade. The policies include stricter regulations on industrial pollution, significant investments in renewable energy sources, and incentives for electric vehicle adoption. Environmental groups have largely praised the move, though some industry leaders warn of potential economic disruptions..."
        },
        {
          id: 3,
          title: "Tech Giants Face Intense Scrutiny in Antitrust Investigation",
          content: "Several major technology firms are under investigation by federal regulators for alleged monopolistic practices and anti-competitive behavior. The inquiry focuses on how these companies leverage their dominance in online advertising, search algorithms, and cloud computing to stifle competition. Lawmakers are calling for increased oversight and potential regulatory reforms to ensure a level playing field for smaller tech startups..."
        },
        {
          id: 4,
          title: "Health Officials Warn of Rising COVID-19 Cases",
          content: "Public health officials have raised concerns about a recent uptick in COVID-19 cases across several regions. The increase is attributed to the emergence of a new subvariant that appears to be more transmissible. Hospitals are beginning to see a rise in admissions, prompting discussions about reintroducing certain preventative measures such as mask mandates and booster shot campaigns..."
        },
        {
          id: 5,
          title: "NASA Successfully Launches Next-Generation Space Telescope",
          content: "NASA has successfully launched its next-generation space telescope, marking a significant milestone in space exploration. The telescope, which will be positioned nearly a million miles from Earth, is designed to capture high-resolution images of distant galaxies, potentially unlocking secrets about the origins of the universe. Scientists expect the first images to be transmitted back to Earth within the next few months..."
        },
        {
          id: 6,
          title: "Rising Interest Rates Impact Housing Market",
          content: "Mortgage rates have climbed to their highest levels in over a decade, causing a slowdown in the housing market. Homebuyers are facing higher borrowing costs, leading to reduced affordability and declining home sales. Real estate experts predict that home prices may start to drop in response to weaker demand..."
        },
        {
          id: 7,
          title: "Major Cyberattack Disrupts Government Operations",
          content: "A sophisticated cyberattack has targeted multiple government agencies, causing significant disruptions to online services and communications. Cybersecurity experts believe the attack originated from a state-sponsored hacking group. Authorities are working to restore systems and assess the full extent of the damage..."
        },
        {
          id: 8,
          title: "AI Technology Advances Rapidly, Raising Ethical Concerns",
          content: "Recent breakthroughs in artificial intelligence have led to major advancements in automation, data analysis, and machine learning. However, experts warn that these developments also raise ethical concerns, including job displacement, privacy risks, and potential misuse of AI-driven decision-making systems..."
        },
        {
          id: 9,
          title: "International Summit Seeks to Address Global Food Crisis",
          content: "World leaders have gathered for an international summit aimed at addressing the ongoing global food crisis. Rising food prices, supply chain disruptions, and climate change have contributed to food shortages in several countries. The summit will focus on coordinated efforts to improve agricultural sustainability and food distribution networks..."
        },
        {
          id: 10,
          title: "Scientists Develop Promising New Cancer Treatment",
          content: "A team of scientists has developed a promising new cancer treatment that uses targeted immunotherapy to attack cancer cells while preserving healthy tissue. Early clinical trials have shown encouraging results, with some patients experiencing significant tumor shrinkage. Researchers are optimistic that this breakthrough could lead to more effective cancer treatments in the near future..."
        },
      ];
    */

      

export default function NewsAnnotationTool() {
    const [articles, setArticles] = useState([]);
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [annotations, setAnnotations] = useState({});
    const [selectedText, setSelectedText] = useState("");
    const [textAnnotations, setTextAnnotations] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [showRightInstructions, setShowRightInstructions] = useState(true);


    const [showSurvey, setShowSurvey] = useState(false);
    const [surveyResponses, setSurveyResponses] = useState({});
    const [confidence, setConfidence] = useState(0);
    const [bias, setBias] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [openFeedback, setOpenFeedback] = useState("");
    const [showThankYou, setShowThankYou] = useState(false);

    const downloadAnnotations = (annotations, textAnnotations, surveyResponses) => {
        const articleTitles = articles.map((article) => ({
            id: article.id,
            title: article.title,
        }));
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        const data = {
          annotations,
          textAnnotations,
          surveyResponses,
          articleTitles,
          timestamp: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `annotations_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
    

    // useEffect(() => {
    //     setArticles(shuffleArray([...sampleArticles]));
    // }, []);

    useEffect(() => {
        fetch("/articles.csv")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              const parsedArticles = results.data.map((item, index) => ({
                id: index + 1,
                title: item["Headline"],
                content: item["News body"],
            }));
            const randomArticles = shuffleArray(parsedArticles).slice(0, 3);
            setArticles(randomArticles);
            },
          });
        });
    }, []);
    /*
        setArticles(shuffleArray([...sampleArticles.slice(0, 3)]));
      }, []);
    */

    const handleNextArticle = () => {
        if (showSurvey) {
            //validate survey responses here
            if (
              confidence === 0 ||
              bias === 0 ||
              difficulty === 0 ||
              openFeedback.trim() === ""
            ) {
              alert("Please answer all survey questions before continuing.");
              return;
            }

                // Validate that there is at least one valid annotation

            const articleId = articles[currentArticleIndex]?.id;
            const annotationsForArticle = textAnnotations[articleId] || [];

            if (annotationsForArticle.length === 0) {
                alert("Please annotate at least one phrase before continuing.");
                return;
              }
          
              const anyInvalid = annotationsForArticle.some(
                (a) => !a.category || !a.subcategory
              );
          
              if (anyInvalid) {
                alert("Each annotation must include a category and subcategory.");
                return;
              }
    // Save survey responses and continue

            setSurveyResponses((prev) => ({
              ...prev,
              [articleId]: { confidence, bias, difficulty, openFeedback },
            }));
      
            if (currentArticleIndex < articles.length - 1) {
              setCurrentArticleIndex(currentArticleIndex + 1);
              setSelectedText("");
              setSelectedCategory("");
              setSelectedSubcategory("");
              setShowSurvey(false);
              setConfidence(0);
              setBias(0);
              setDifficulty(0);
              setOpenFeedback("");
            } else {
              setShowThankYou(true);
            }
          } else {
            setShowSurvey(true);
          }
        };
    

    const handleAnnotation = (label) => {
        const articleId = articles[currentArticleIndex]?.id;
        if (!articleId) return;

        setAnnotations((prevAnnotations) => ({
            ...prevAnnotations,
            [articleId]: label,
        }));

        alert(`Article labeled as: ${label}`);
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection.toString().trim() !== "") {
            setSelectedText(selection.toString().trim());
        }
    };

    const handleTextAnnotation = () => {
        if (selectedText && selectedCategory && selectedSubcategory) {
            const articleId = articles[currentArticleIndex]?.id;
            setTextAnnotations((prevAnnotations) => ({
                ...prevAnnotations,
                [articleId]: [
                    ...(prevAnnotations[articleId] || []),
                    { text: selectedText, category: selectedCategory, subcategory: selectedSubcategory },
                ],
            }));
            setSelectedText("");
            setSelectedCategory("");
            setSelectedSubcategory("");
        } else {
            alert("Please select a high-level category and a subcategory.");
        }
    };

    const handleRemoveAnnotation = (articleId, index) => {
        setTextAnnotations((prevAnnotations) => {
            const updatedAnnotations = [...(prevAnnotations[articleId] || [])];
            updatedAnnotations.splice(index, 1);
            return {
                ...prevAnnotations,
                [articleId]: updatedAnnotations,
            };
        });
    };

    const categoryOptions = {
        Persuasive_Propaganda: ["Repetition", "Exaggeration", "Flag-Waving", "Slogans", "Bandwagon", "Causal Oversimplification", "Doubt"],
        Inflammatory_Language: ["Demonization", "Name-Calling", "Hyperbole", "Straw Man Arguments"],
    };

    // useEffect(() => {
    //     if (showThankYou) {
    //       downloadAnnotations(annotations, textAnnotations, surveyResponses);
    //     }
    //   }, [showThankYou]);


    useEffect(() => {
        if (showThankYou) {
            const articleTitles = articles.map((article) => ({
                id: article.id,
                title: article.title,
            }))
          const data = {
            annotations,
            textAnnotations,
            surveyResponses,
            articleTitles,
            timestamp: new Date().toISOString(),
          };
    
          const submissionsRef = ref(database, "submissions");
          push(submissionsRef, data)
            .then(() => {
              console.log("Submission saved to Firebase");
            })
            .catch((error) => {
              console.error("Error saving to Firebase:", error);
            });
        }
      }, [showThankYou]);


    if (showThankYou) {
        const generateCode = () => `MTURK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const completionCode = generateCode();


        return (
          <div className="w-full h-screen flex items-center justify-center bg-white">
            <div className="max-w-xl text-center p-6 border border-gray-300 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">🎉 Thank You!</h2>
              <p className="mb-4 text-gray-700">Thank you for taking part in this study. Your responses have been recorded.</p>
              <p className="mb-4 text-gray-700">Please copy and paste the following completion code into MTurk:</p>
              <div className="bg-gray-100 text-lg font-mono p-4 rounded border border-dashed border-gray-400 mb-4">{completionCode}</div>
              <p className="text-sm text-gray-500">You may now close this window or return to the task page.</p>
              {process.env.NODE_ENV !== "production" && (
            <Button onClick={() => downloadAnnotations(annotations, textAnnotations, surveyResponses)} className="mt-4 bg-purple-600 text-white">
              Download All Responses (JSON)
            </Button>
          )
  }          
            </div>
          </div>
        );
      }

    return (
        <div className="flex w-full justify-center items-start min-h-screen bg-gray-100">
            {/* Instructions Sidebar */}
            <div className={`w-1/4 p-4 bg-gray-200 shadow-md transition-all duration-300 ${showRightInstructions ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"}`}>
                <h3 className="text-lg font-bold mb-2">Annotation Guide</h3>
                <p className="text-sm mb-2">Use the following categories for labeling:</p>
                <div className="bg-yellow-100 p-2 rounded mb-2">
                    <div></div>
                  <div className="bg-yellow-100 p-3 rounded mb-3">
                    <strong className="text-yellow-600 text-center block mb-2 text-base">Persuasive Propaganda</strong>
                    <DropdownItem icon=" " title="Repetition">Reinforcing a message by repeating it.</DropdownItem>
                    <DropdownItem icon=" " title="Exaggeration">Overstating or distorting facts.</DropdownItem>
                    <DropdownItem icon=" " title="Flag-Waving">Linking a message to patriotism or national pride.</DropdownItem>
                    <DropdownItem icon=" " title="Slogans">Catchy, emotional phrases designed to influence opinions.</DropdownItem>
                    <DropdownItem icon=" " title="Bandwagon">Encouraging action by claiming "everyone is doing it."</DropdownItem>
                    <DropdownItem icon=" " title="Casual Oversimplification">Reducing a complex issue to a single cause or solution.</DropdownItem>
                    <DropdownItem icon=" " title="Doubt">Sowing uncertainty or questioning the credibility of evidence.</DropdownItem>
                </div>

                </div>
                <div className="bg-red-100 p-2 rounded mb-6">
                    <strong className="text-red-600 text-center block mb-3 mt-3">Inflammatory Language</strong>
                    <ul className="text-s text-center ml-2">
                    <DropdownItem icon=" " title="Name-Calling">Using demeaning labels or insults to discredit opponents.</DropdownItem>
                    <DropdownItem icon=" " title="Hyperbole">Exaggerating to provoke fear, anger, or excitement.</DropdownItem>
                    <DropdownItem icon=" " title="Demonization">Portraying individuals or groups as evil, immoral, or dangerous.</DropdownItem>
                    <DropdownItem icon=" " title="Straw-Man">Misrepresenting someone's argument to make it easier to attack.</DropdownItem>
                    </ul>
                </div>
            
                <Button onClick={() => 
                  setShowRightInstructions(false)} className="bg-gray-600 text-white w-full">Close Guide</Button>
            </div>
            

            {/* Main Content */}
            <div className="w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
                <Button onClick={() => setShowRightInstructions(!showRightInstructions)} className="bg-blue-600 text-white mb-4">
                    {showRightInstructions ? "Hide Instructions" : "Show Instructions"}
                </Button>

                {articles.length > 0 && (
                    <Card>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {articles[currentArticleIndex]?.title}
                        </h2>
                        <CardContent>
                            <p className="text-gray-700" onMouseUp={handleTextSelection}>
                                {articles[currentArticleIndex]?.content}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Annotation Buttons */}
                <div className="mt-4 flex justify-center space-x-4">
                    <Button onClick={() => handleAnnotation("Flame Rhetoric")} className="bg-red-500">
                        Flame Rhetoric
                    </Button>
                    <Button onClick={() => handleAnnotation("Propaganda")} className="bg-yellow-500">
                        Persuasive Propaganda
                    </Button>
                </div>

                {/* Highlighted Text Annotation */}
                {selectedText && (
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-sm text-gray-700 mb-2">Selected Text: "{selectedText}"</p>
                        <select className="p-2 border border-gray-300 rounded-md mb-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Select a Category</option>
                            {Object.keys(categoryOptions).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {selectedCategory && (
                            <select className="p-2 border border-gray-300 rounded-md mb-2" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                                <option value="">Select a Subcategory</option>
                                {categoryOptions[selectedCategory].map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                    </option>
                                ))}
                            </select>
                        )}
                        <Button onClick={handleTextAnnotation} className="bg-blue-500">
                            Save Annotation
                        </Button>
                    </div>
                )}

     {/* Next Article Button */}
     {/* <div className="mt-6">
     <Button onClick={handleNextArticle} disabled={currentArticleIndex >= articles.length - 1} className="bg-blue-500">
       Next Article
     </Button>
   </div> */}
                {/* Display Annotations with Remove Feature */}
                {textAnnotations[articles[currentArticleIndex]?.id]?.length > 0 && (
                    <div className="mt-6 bg-gray-100 p-4 rounded-md">
                        <h3 className="text-lg font-semibold">Annotated Text Excerpts:</h3>
                        {textAnnotations[articles[currentArticleIndex]?.id].map((annotation, index) => (
                            <div key={index} className="flex justify-between items-center mt-2">
                                <p className="text-sm text-red-600">"{annotation.text}" - {annotation.category} → {annotation.subcategory}</p>
                                <Button onClick={() => handleRemoveAnnotation(articles[currentArticleIndex]?.id, index)} className="bg-gray-400 text-white text-xs px-2 py-1 rounded">
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                )}


            {/* Survey Form */}
        {showSurvey ? (
          <div className="mt-8 text-left">
            <h3 className="text-lg font-semibold mb-2">🧠 Post-Annotation Survey</h3>

            <label className="block mt-4">1. How confident are you in your tagging decisions?</label>
            <select value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full p-2 border rounded">
              <option value={0}>Select</option>
              <option value={1}>1 – Not at all confident</option>
              <option value={2}>2 – Slightly confident</option>
              <option value={3}>3 – Moderately confident</option>
              <option value={4}>4 – Very confident</option>
              <option value={5}>5 – Extremely confident</option>
            </select>

            <label className="block mt-4">2. To what extent is the article misleading or biased?</label>
            <select value={bias} onChange={(e) => setBias(Number(e.target.value))} className="w-full p-2 border rounded">
              <option value={0}>Select</option>
              <option value={1}>1 – Not at all</option>
              <option value={2}>2 – Slightly</option>
              <option value={3}>3 – Moderately</option>
              <option value={4}>4 – Very much</option>
              <option value={5}>5 – Extremely</option>
            </select>

            <label className="block mt-4">3. How difficult was it to tag the article?</label>
            <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="w-full p-2 border rounded">
              <option value={0}>Select</option>
              <option value={1}>1 – Not at all difficult</option>
              <option value={2}>2 – Slightly difficult</option>
              <option value={3}>3 – Moderately difficult</option>
              <option value={4}>4 – Very difficult</option>
              <option value={5}>5 – Extremely difficult</option>
            </select>

            <label className="block mt-4">4. Why did you tag this way? What made it stand out?
            Please explain your reasoning by referring to the specific words, phrases, or sentences you highlighted.
            Provide your reasoning for each of the highlights you made in this article. Explain why you believe they represent persuasive propaganda, inflammatory language, or something misleading.

            </label>
            <textarea value={openFeedback} onChange={(e) => setOpenFeedback(e.target.value)} rows={6} className="w-full p-2 border rounded" placeholder="For example: “I tagged the phrase ‘reckless and corrupt regime’ as inflammatory because it uses strong language to attack without evidence.."></textarea>

            <Button
              onClick={handleNextArticle}
              className="mt-4 bg-green-600 text-white"
              disabled={confidence === 0 || bias === 0 || difficulty === 0 || openFeedback.trim() === ""}
            >
              {currentArticleIndex < articles.length - 1 ? "Submit Survey & Load Next Article" : "Finish"}
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <Button onClick={handleNextArticle} className="bg-blue-500">Next Article</Button>
          </div>
        )}
            </div>


{/* Instructions Panel on Right */}
<div className={`w-1/4 p-4 bg-white transition-all duration-300 ${showRightInstructions ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"}`}>
    <h3 className="text-lg font-bold mb-3">📝 Instructions</h3>
    <p className="text-sm">
    You will annotate <strong>3 news articles</strong>. For each article, please follow these steps:
  </p>
  <div className="h-4" />
  <div className="h-4" />
  <ul className="list-decimal list-inside text-sm space-y-1">
    <li>
      <strong>Highlight a section of text</strong> between [] and [] words that you want to annotate.
    </li>
    <div className="h-3" />
    <li>
      Scroll down and <strong>select a category</strong> using either the buttons or the dropdown menu (e.g., <em>Flame Rhetoric</em> or <em>Persuasive Propaganda</em>).
    </li>
    <div className="h-3" />
    <li>
      <strong>Choose a subcategory</strong> (e.g., <em>Exaggeration</em>). Your annotation will be saved automatically.
    </li>
    <div className="h-3" />
    <li>
      Click <strong>"Next Article"</strong> to complete the brief post-article survey.
    </li>
    <div className="h-3" />
    <li>
      Select <strong>"Submit Survey and Load Next Article"</strong> to move on to the next article.
    </li>
    <div className="h-3" />
  </ul>
  <p></p>
<div className="h-4" />
<p></p>
  <p className="text-sm text-gray-500 italic">
    Make sure your highlights are thoughtful and fall within the required word range—your input helps us better understand how people detect biased or misleading content.
  </p>
</div>
        </div>
    );
}