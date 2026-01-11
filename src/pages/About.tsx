import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EDDACE]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 text-[#5C4033]"
        >
          ← Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C24C1A] to-[#1E8D70] bg-clip-text text-transparent">
            About the Founder
          </h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 space-y-6 text-lg leading-relaxed">
            <p className="text-[#5C4033]">
              <strong>ReFURRM Ai Studio</strong> was created by <strong>Teresa "Tree" Furr</strong>, 
              a multi-discipline creator with more ideas than hours in the day. Between school, 
              building businesses, raising a creative daughter, and surviving real life, Tree learned 
              the hard way that creativity fails not because people lack talent, but because they lack 
              time, systems, and support.
            </p>

            <p className="text-[#5C4033]">
              For years, Tree watched brilliant artists, writers, designers, and visionaries lose 
              momentum simply because they couldn't finish a product, format a file, write listings, 
              or market what they made. Even her daughter Harley, a gifted artist with her own unique 
              style, struggled to keep up with the "business side" of creativity.
            </p>

            <p className="font-semibold text-[#C24C1A]">
              Tree built ReFURRM Ai Studio to fix that.
            </p>

            <p className="text-[#5C4033]">
              A platform for people like her.<br />
              People with genius but no bandwidth.
            </p>

            <p className="text-[#5C4033]">
              ReFURRM Ai Studio handles the heavy lifting. Creators upload a file or speak an idea. 
              The platform builds everything else. Product pages. Mockups. Descriptions. Social posts. 
              Emails. Landing pages. Launch kits. It's the assistant every creator wishes they had.
            </p>

            <p className="font-semibold text-[#5C4033]">
              Tree built this studio with one goal.<br />
              To make creativity easier.<br />
              To make finishing possible.<br />
              To give artists and visionaries a place where their ideas don't die in a notes app or a sketchbook.
            </p>

            <p className="text-[#5C4033]">
              This is a studio for creators who think fast, dream big, pivot often, and don't have time 
              for the boring stuff.
            </p>

            <p className="text-center font-bold text-xl text-[#C24C1A] mt-8">
              Tree built it for herself.<br />
              She built it for Harley.<br />
              And she built it for every creator who deserves to see their ideas become something real.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-[#C24C1A] hover:bg-[#A63D14]"
          >
            Start Creating Today
          </Button>
        </div>
      </div>
    </div>
  );
}
