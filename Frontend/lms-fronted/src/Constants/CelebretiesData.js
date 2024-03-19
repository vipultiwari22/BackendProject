import apj from "../assets/images/apj.png";
import billGates from "../assets/images/billGates.png";
import einstein from "../assets/images/einstein.png";
import nelsonMandela from "../assets/images/nelsonMandela.png";
import stevejobs from "../assets/images/steveJobs.png";

const celebrities = [
  {
    title: "Nelson Mandela",
    description:
      "Education is the most powerful tool you can use to change the world.",
    image: nelsonMandela,
    slideNumber: 1,
  },
  {
    title: "APJ Abdul Kalam",
    description:
      "Let us sacrifice our today so that our children can have a better tomorrow.",
    image: apj,
    slideNumber: 2,
  },
  {
    title: "Albert Einstein",
    description:
      "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.",
    image: einstein,
    slideNumber: 3,
  },
  {
    title: "Steve Jobs",
    description:
      "The people who are crazy enough to think they can change the world are the ones who do.",
    image: stevejobs,
    slideNumber: 4,
  },
  {
    title: "Bill Gates",
    description:
      "Your most unhappy customers are your greatest source of learning.",
    image: billGates,
    slideNumber: 5,
  },
];

export default celebrities;
