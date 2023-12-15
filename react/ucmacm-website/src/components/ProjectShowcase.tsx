import Card from '../ui/base/card'
import Dogg from '../assets/test-images/dogg.jpg'

const ProjectShowcase = () => {
  return (
    <>
    <div className="grid grid-flow-col grid-cols-4 justify-center gap-y-3 gap-x-3">
    <Card description="This is my card" logo={Dogg}/>
    <Card description="This is my card" logo={Dogg}/>
    <Card description="This is my card" logo={Dogg}/>
    <Card description="This is my card" logo={Dogg}/>
    </div>
    </>
  );
};

export default ProjectShowcase;
