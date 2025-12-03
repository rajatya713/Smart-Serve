import { useState } from "react";

const Rulebook = () => {
    const [expanded, setExpanded] = useState(false);

    const preview =
        "Here are the important rules for the hackathon. Please read the complete rulebook for detailed guidelines...";

    const full = `
1. Team Formation: Participants can form teams of 2 to 4 members.
2. Group leader need to fill the online registration form and fill the details of all members.
3. Registration fee is non refundable
4. We encourage multidisciplinary participations
5. Student can participate only in team
6. At least one member must be present on the allocated area
7. All work must be created during the hackathon.
8. Teams have to present their solution in the form of a prototype
9. Projects must align with the given hackathon themes or challenges.
10. All projects must be submitted by the designated deadline, including project description, code, and Presentation
11. Project Scope: Teams can work on any project within the given theme. The scope can be limited to a specific technology or platform based on the event's guidelines.
12. Time Limit: The Hackathon will have a specific time limit.
13. The use of pre-existing code or projects is not allowed, except for open-source libraries or frameworks.
14. Code Ownership: All code developed during the Hackathon should be the original work of the team. Participants cannot use code or assets created by someone else without proper permissions or licenses.
15. Collaboration: Teams are encouraged to collaborate and seek help from mentors or organizers, but cross-team collaboration is not allowed during the competition.
16. Presentation: Each team will have to present their project to the judging panel. The presentation should demonstrate the functionality and features of the project, as well as any unique or innovative aspects.
17. Judging Criteria: The judging criteria for the Hackathon will be clearly communicated to the participants before the event. The result by the judge will be final. It may include aspects such as innovation, technical implementation, user experience, scalability, and relevance to the theme.
18. Fair Play: Participants must adhere to ethical standards and abide by the rules and regulations set by the organizers. Any form of cheating, plagiarism, or unfair practices will result in immediate disqualification.
19. Intellectual Property: Participants retain full ownership of the intellectual property rights to their projects. However, organizers may request participants to share their code or project details for promotional or showcase purposes.
20. Code Submission: Teams must submit their code and project documentation before the specified deadline. Late submissions may result in penalties or disqualification.
21. Code Validation: Organizers may conduct code validation to ensure that the project was developed within the given time frame and complies with the rules and regulations.
22. Code Sharing: Participants are encouraged to share their code and projects with the wider community after the Hackathon. Open sourcing or publishing the code on platforms like GitHub is often appreciated.
23. Code of Conduct: Participants should adhere to a code of conduct that promotes inclusivity, respect, and professionalism. Any form of harassment, discrimination, or inappropriate behaviour will not be tolerated.
24. Prizes and Awards: The Hackathon will offer prizes or awards to winning teams based on the judging criteria.
25. Disputes and Arbitration: In case of any disputes or concerns, the decision of the organizers and judging panel will be final. Any disagreements or issues should be resolved through an arbitration process outlined by the organizers.
26. Liability: The organizers and sponsors of the Hackathon hold no liability for any damages, losses, or injuries incurred during the event. Participants are responsible for their own safety, equipment, and actions.
27. Changes to the Rules: Organizers reserve the right to make changes to the Hackathon rules, format, or prizes at any time. Any modifications will be communicated to the participants in a clear and timely manner.
28. There will be no TA/DA for the participants to attend hackathon.
Note: There will be three (First, Second and Third) prizes. Decision of the evaluation panel members based on the performance of the team will be final.
`;

    return (
        <div className="m-12 p-4 bg-white rounded-xl shadow-lg border">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                Hackathon Rulebook
            </h2>

            <p className="text-gray-700 whitespace-pre-line">
                {expanded ? full : preview}
            </p>

            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition"
            >
                {expanded ? "Read Less ▲" : "Read More ▼"}
            </button>
        </div>
    );
};

export default Rulebook;
