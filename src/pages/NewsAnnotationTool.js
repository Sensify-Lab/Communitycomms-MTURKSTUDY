import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";


// Function to shuffle array randomly
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };


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
        // 40 more articles continue...
      ];
      

export default function NewsAnnotationTool() {
    const [articles, setArticles] = useState([]);
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [annotations, setAnnotations] = useState({});
    const [selectedText, setSelectedText] = useState("");
    const [textAnnotations, setTextAnnotations] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {
        setArticles(shuffleArray([...sampleArticles]));
    }, []);

    const handleNextArticle = () => {
        if (currentArticleIndex < articles.length - 1) {
            setCurrentArticleIndex(currentArticleIndex + 1);
            setSelectedText("");
            setSelectedCategory("");
            setSelectedSubcategory("");
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

    return (
        <div className="flex w-full">
            {/* Instructions Sidebar */}
            <div className={`w-1/4 p-4 bg-gray-200 shadow-md transition-all duration-300 ${showInstructions ? "visible opacity-100" : "invisible opacity-0"}`}>
                <h3 className="text-lg font-bold mb-2">Annotation Guide</h3>
                <p className="text-sm mb-2">Use the following categories for labeling:</p>
                <div className="bg-yellow-100 p-2 rounded mb-2">
                    <strong className="text-yellow-600">Persuasive Propaganda</strong>
                    <ul className="text-xs">
                        <li>✔ Repetition: Reinforcing a message by repeating it.</li>
                        <li>✔ Exaggeration: Overstating or distorting facts.</li>
                        <li>✔ Flag-Waving: Linking a message to patriotism.</li>
                    </ul>
                </div>
                <div className="bg-red-100 p-2 rounded mb-2">
                    <strong className="text-red-600">Inflammatory Language</strong>
                    <ul className="text-xs">
                        <li>🔥 Name-Calling: Using insults to attack credibility.</li>
                        <li>🔥 Hyperbole: Extreme exaggeration to provoke emotions.</li>
                    </ul>
                </div>
                <Button onClick={() => setShowInstructions(false)} className="bg-gray-600 text-white w-full">Close Guide</Button>
            </div>

            {/* Main Content */}
            <div className="w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
                <Button onClick={() => setShowInstructions(!showInstructions)} className="bg-blue-600 text-white mb-4">
                    {showInstructions ? "Hide Instructions" : "Show Instructions"}
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
                    <Button onClick={() => handleAnnotation("Neutral")} className="bg-green-500">
                        Neutral Reporting
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
     <div className="mt-6">
     <Button onClick={handleNextArticle} disabled={currentArticleIndex >= articles.length - 1} className="bg-blue-500">
       Next Article
     </Button>
   </div>


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
            </div>
        </div>
    );
}