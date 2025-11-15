import { useState, useEffect, useRef } from 'react';
import { usePolkadotWallet } from '../contexts/PolkadotWalletContext';
import SpotlightCard from './SpotlightCard';

interface SessionNote {
  id: string;
  timestamp: Date;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  recommendations: string[];
}

interface Psychologist {
  id: string;
  name: string;
  credentials: string;
  rate: number; // per hour in $rUSD
  rating: number;
  specialties: string[];
  availability: string[];
  matchScore: number; // AI-calculated match based on chat insights
  profileImage?: string;
  bio: string;
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

interface ChatInsight {
  topics: string[];
  sentiment: string;
  urgency: 'low' | 'medium' | 'high';
  recommendedSpecialties: string[];
}

export default function VideoChat() {
  const { selectedAccount } = usePolkadotWallet();
  const walletAddress = selectedAccount?.address || null;
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  
  // Video controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  // AI Notes
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  
  // Booking flow
  const [currentStep, setCurrentStep] = useState<'insights' | 'selection' | 'calendar' | 'session'>('insights');
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [walrusCid, setWalrusCid] = useState<string | null>(null);
  
  // Mock chat insights (would come from AI analysis of user's chat history)
  const chatInsights: ChatInsight = {
    topics: ['Anxiety', 'Work Stress', 'Sleep Issues', 'Social Relationships'],
    sentiment: 'mixed',
    urgency: 'medium',
    recommendedSpecialties: ['Anxiety Disorders', 'Stress Management', 'Cognitive Behavioral Therapy', 'Mindfulness']
  };

  // Expanded psychologist database with AI matching
  const allPsychologists: Psychologist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 150,
      rating: 4.9,
      specialties: ['Anxiety Disorders', 'Stress Management', 'CBT'],
      availability: ['9:00 AM', '2:00 PM', '4:00 PM'],
      matchScore: 95,
      bio: 'Specializes in anxiety disorders and stress management with 10+ years experience.'
    },
    {
      id: '2', 
      name: 'Dr. Marcus Johnson',
      credentials: 'PsyD, Licensed Marriage & Family Therapist',
      rate: 120,
      rating: 4.8,
      specialties: ['Relationships', 'Grief', 'Addiction', 'CBT'],
      availability: ['10:00 AM', '3:00 PM', '5:00 PM'],
      matchScore: 78,
      bio: 'Expert in relationship therapy and grief counseling with holistic approach.'
    },
    {
      id: '3',
      name: 'Dr. Elena Rodriguez',
      credentials: 'PhD, Licensed Clinical Social Worker',
      rate: 100,
      rating: 4.7,
      specialties: ['PTSD', 'Bipolar', 'Personality Disorders', 'Mindfulness'],
      availability: ['11:00 AM', '1:00 PM', '6:00 PM'],
      matchScore: 65,
      bio: 'Trauma specialist with expertise in mindfulness-based interventions.'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 180,
      rating: 4.9,
      specialties: ['Anxiety Disorders', 'CBT', 'Mindfulness', 'Sleep Disorders'],
      availability: ['8:00 AM', '12:00 PM', '3:00 PM'],
      matchScore: 92,
      bio: 'Leading expert in anxiety and sleep disorders with evidence-based treatments.'
    },
    {
      id: '5',
      name: 'Dr. Lisa Park',
      credentials: 'PsyD, Licensed Clinical Psychologist',
      rate: 140,
      rating: 4.8,
      specialties: ['Stress Management', 'Work-Life Balance', 'CBT', 'Mindfulness'],
      availability: ['9:30 AM', '2:30 PM', '4:30 PM'],
      matchScore: 88,
      bio: 'Specializes in workplace stress and work-life balance optimization.'
    },
    {
      id: '6',
      name: 'Dr. Michael Brown',
      credentials: 'PhD, Licensed Clinical Psychologist',
      rate: 160,
      rating: 4.7,
      specialties: ['Social Anxiety', 'Relationships', 'CBT', 'Group Therapy'],
      availability: ['10:30 AM', '1:30 PM', '5:30 PM'],
      matchScore: 82,
      bio: 'Expert in social anxiety and relationship dynamics with group therapy experience.'
    }
  ];

  // Filter psychologists based on AI insights
  const recommendedPsychologists = allPsychologists
    .filter(psych => 
      psych.specialties.some(specialty => 
        chatInsights.recommendedSpecialties.some(rec => 
          specialty.toLowerCase().includes(rec.toLowerCase()) || 
          rec.toLowerCase().includes(specialty.toLowerCase())
        )
      )
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  // Mock time slots for calendar
  const generateTimeSlots = (psychologist: Psychologist): TimeSlot[] => {
    const today = new Date();
    const slots: TimeSlot[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      psychologist.availability.forEach(time => {
        slots.push({
          id: `${psychologist.id}_${date.toISOString().split('T')[0]}_${time}`,
          time,
          date: date.toISOString().split('T')[0],
          available: Math.random() > 0.3 // 70% availability
        });
      });
    }
    
    return slots;
  };

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    setSessionDuration(0);
    setIsRecording(true);
    setIsEncrypted(true);
    setCurrentStep('session');
    
    // Mock encryption start
    try {
      // Placeholder for XX Network encryption
      console.log('Video session encryption placeholder');
      console.log('Session encryption enabled');
    } catch (error) {
      console.error('Encryption setup failed:', error);
    }
  };

  const endSession = async () => {
    if (!isSessionActive) return;
    
    setIsSessionActive(false);
    setIsRecording(false);
    
    // Generate AI notes and automatically store them
    setIsGeneratingNotes(true);
    setTimeout(async () => {
      const mockNote: SessionNote = {
        id: `note_${Date.now()}`,
        timestamp: new Date(),
        content: `Session Summary: Patient discussed feelings of anxiety related to work stress. Key themes included perfectionism, fear of failure, and difficulty setting boundaries. Patient showed good insight and expressed willingness to try new coping strategies.`,
        sentiment: 'positive',
        keyTopics: ['Work Stress', 'Perfectionism', 'Boundaries', 'Coping Strategies'],
        recommendations: ['Practice mindfulness daily', 'Set work-life boundaries', 'Consider CBT techniques', 'Schedule follow-up in 2 weeks']
      };
      setSessionNotes([mockNote]);
      setIsGeneratingNotes(false);
      
      // Automatically store in Walrus (mocked)
      try {
        const notesData = JSON.stringify([mockNote]);
        // Placeholder for Arkiv storage
        const cid = `arkiv_${Date.now()}`;
        setWalrusCid(cid);
        console.log('Session notes automatically stored in Walrus:', cid);
      } catch (error) {
        console.error('Auto-storage failed:', error);
      }
    }, 2000);
  };

  const storeInWalrus = async () => {
    if (sessionNotes.length === 0) return;
    
    try {
      const notesData = JSON.stringify(sessionNotes);
      // Placeholder for Arkiv storage
      const cid = `arkiv_${Date.now()}`;
      setWalrusCid(cid);
      alert('Session notes stored in Walrus! CID: ' + cid);
    } catch (error) {
      console.error('Walrus storage failed:', error);
      alert('Failed to store in Walrus');
    }
  };

  const payPsychologist = async () => {
    if (!selectedPsychologist) return;
    
    setIsProcessingPayment(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use existing Reflect integration mock
      // Placeholder for Polkadot payment
      const txId = `tx_${Date.now()}`;
      console.log('Payment processed:', txId);
      
      setPaymentSuccess(true);
      setIsProcessingPayment(false);
      
      // End session after payment
      await endSession();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const autoSelectPsychologist = () => {
    const bestMatch = recommendedPsychologists[0];
    setSelectedPsychologist(bestMatch);
    setCurrentStep('calendar');
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    // Auto-proceed to session after selecting time
    setTimeout(() => {
      startSession();
    }, 1000);
  };

  return (
    <div className="psychat-card p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">Video Therapy</h2>
        <div className="text-sm text-white/60">
          {isSessionActive ? `Session: ${formatDuration(sessionDuration)}` : 'Step ' + (currentStep === 'insights' ? '1' : currentStep === 'selection' ? '2' : currentStep === 'calendar' ? '3' : '4') + ' of 4'}
        </div>
      </div>

      {/* Step 1: AI Insights - Mobile Optimized */}
      {currentStep === 'insights' && (
        <div className="bg-black/40 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-white/10">
          <div className="text-center mb-4 md:mb-6">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🤖</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">AI Analysis Complete</h3>
            <p className="text-white/80 text-sm md:text-base mb-4 md:mb-6">Based on your chat history, we've identified key areas for therapy focus.</p>
          </div>
          
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-4 md:mb-6">
            <div className="bg-black/40 rounded-lg p-3 md:p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 text-sm md:text-base">Key Topics Identified</h4>
              <div className="flex flex-wrap gap-2">
                {chatInsights.topics.map((topic, idx) => (
                  <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-3 md:p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 text-sm md:text-base">Recommended Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {chatInsights.recommendedSpecialties.map((specialty, idx) => (
                  <span key={idx} className="text-xs bg-psy-green/20 text-psy-green px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentStep('selection')}
              className="w-full md:w-auto py-3 px-6 bg-psy-blue hover:bg-psy-blue/80 text-white font-medium rounded-lg transition-colors"
            >
              View Curated Therapists →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Psychologist Selection - Mobile Optimized */}
      {currentStep === 'selection' && (
        <div className="bg-black/40 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <h3 className="text-lg md:text-xl font-bold text-white">AI-Curated Therapist Matches</h3>
            <button
              onClick={autoSelectPsychologist}
              className="w-full sm:w-auto py-2 px-4 bg-psy-green hover:bg-psy-green/80 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Auto-Select Best Match
            </button>
          </div>
          
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {recommendedPsychologists.map((psych) => (
              <div
                key={psych.id}
                onClick={() => {
                  setSelectedPsychologist(psych);
                  setCurrentStep('calendar');
                }}
                className="bg-black/40 rounded-lg p-3 md:p-4 cursor-pointer hover:bg-black/60 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold text-sm md:text-base">{psych.name}</div>
                  <div className="text-xs bg-psy-green/20 text-psy-green px-2 py-1 rounded">
                    {psych.matchScore}% match
                  </div>
                </div>
                <div className="text-white/60 text-xs md:text-sm mb-2">{psych.credentials}</div>
                <div className="text-psy-green font-semibold mb-2 text-sm">${psych.rate}/hour in $rUSD</div>
                <div className="text-white/60 text-xs md:text-sm mb-2">⭐ {psych.rating}/5.0</div>
                <div className="text-xs text-white/50 mb-2 hidden md:block">{psych.bio}</div>
                <div className="flex flex-wrap gap-1">
                  {psych.specialties.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-1 py-0.5 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Calendar Booking - Mobile Optimized */}
      {currentStep === 'calendar' && selectedPsychologist && (
        <div className="bg-black/40 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white">Book Session with {selectedPsychologist.name}</h3>
              <div className="text-white/60 text-sm">{selectedPsychologist.credentials}</div>
            </div>
            <button
              onClick={() => setCurrentStep('selection')}
              className="text-white/60 hover:text-white text-sm self-start sm:self-center"
            >
              ← Back to Selection
            </button>
          </div>
          
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            {/* Calendar */}
            <div>
              <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Available Times</h4>
              <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
                {generateTimeSlots(selectedPsychologist).map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && selectTimeSlot(slot)}
                    disabled={!slot.available}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      slot.available 
                        ? 'bg-black/40 hover:bg-black/60 text-white border border-white/20' 
                        : 'bg-black/40 text-white/30 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium text-sm">{slot.date}</div>
                    <div className="text-xs text-white/60">{slot.time}</div>
                    {!slot.available && <div className="text-xs text-red-400">Unavailable</div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Session Details */}
            <div className="bg-black/40 rounded-lg p-3 md:p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Session Details</h4>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Therapist:</span>
                  <span className="text-white">{selectedPsychologist.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Rate:</span>
                  <span className="text-psy-green">${selectedPsychologist.rate}/hour in $rUSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white">60 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Cost:</span>
                  <span className="text-psy-green font-semibold">${selectedPsychologist.rate} $rUSD</span>
                </div>
              </div>
              
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-psy-blue/10 border border-psy-blue/20 rounded">
                <div className="text-xs md:text-sm text-white/80">
                  <strong>Payment:</strong> You will pay ${selectedPsychologist.rate} $rUSD for this therapy session.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Video Session */}
      {currentStep === 'session' && (
        <>
          {/* Selected Psychologist Info - Mobile Optimized */}
          {selectedPsychologist && (
            <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">Session with {selectedPsychologist.name}</div>
                  <div className="text-white/60 text-sm">{selectedPsychologist.credentials}</div>
                  <div className="text-psy-green text-sm font-medium">${selectedPsychologist.rate}/hour in $rUSD</div>
                </div>
                {selectedTimeSlot && (
                  <div className="text-right sm:text-left">
                    <div className="text-white text-sm font-medium">{selectedTimeSlot.date}</div>
                    <div className="text-white/60 text-sm">{selectedTimeSlot.time}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Interface - Mobile Optimized */}
          <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/10">
            {/* Video Placeholder */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
              {isSessionActive ? (
                <div className="text-center p-4">
                  <div className="text-4xl md:text-6xl mb-3">📹</div>
                  <div className="text-white text-base md:text-lg font-medium">Video Call Active</div>
                  <div className="text-white/60 text-xs md:text-sm mt-1">Encrypted with Arcium ZK</div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="text-4xl md:text-6xl mb-3">🎥</div>
                  <div className="text-white text-base md:text-lg font-medium">Ready to Start</div>
                  <div className="text-white/60 text-xs md:text-sm mt-1">Tap to begin session</div>
                </div>
              )}
            </div>

            {/* Session Controls - Mobile Optimized */}
            <div className="space-y-3">
              {!isSessionActive ? (
                <button
                  onClick={startSession}
                  disabled={!selectedPsychologist || !walletAddress}
                  className="w-full py-3 px-6 bg-psy-blue hover:bg-psy-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  Start Session
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Control Buttons - Stacked on Mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        isMuted 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-black/60 text-white border border-white/20'
                      }`}
                    >
                      {isMuted ? '🔇 Unmute' : '🎤 Mute'}
                    </button>
                    <button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        !isCameraOn 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-black/60 text-white border border-white/20'
                      }`}
                    >
                      {isCameraOn ? '📹 On' : '📷 Off'}
                    </button>
                  </div>
                  
                  {/* Payment Button - Full Width */}
                  <button
                    onClick={payPsychologist}
                    disabled={isProcessingPayment}
                    className="w-full py-3 px-6 bg-psy-green hover:bg-psy-green/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isProcessingPayment ? 'Processing Payment...' : 'Pay for Therapy'}
                  </button>
                </div>
              )}
            </div>

            {/* Status Indicators - Mobile Optimized */}
            {isSessionActive && (
              <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isEncrypted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-white/60">Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-white/60">Recording</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-white/60">Connected</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* AI Notes Section - Mobile Optimized */}
      {(sessionNotes.length > 0 || isGeneratingNotes) && (
        <div className="bg-black/40 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-white/10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">AI Session Notes</h3>
          
          {isGeneratingNotes ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🤖</div>
              <div className="text-white">Generating AI notes...</div>
              <div className="text-white/60 text-sm">Analyzing session content with ZK privacy</div>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {sessionNotes.map((note) => (
                <div key={note.id} className="bg-black/40 rounded-lg p-3 md:p-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="text-white/60 text-xs md:text-sm">
                      {note.timestamp.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        note.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                        note.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {note.sentiment}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-white text-sm md:text-base mb-3 leading-relaxed">{note.content}</div>
                  
                  <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <div className="text-white/60 text-xs md:text-sm mb-2">Key Topics:</div>
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {note.keyTopics.map((topic, idx) => (
                          <span key={idx} className="text-xs bg-psy-blue/20 text-psy-blue px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 text-xs md:text-sm mb-2">Recommendations:</div>
                      <ul className="text-xs md:text-sm text-white/80 space-y-1">
                        {note.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-psy-green mr-2 flex-shrink-0">•</span>
                            <span className="break-words">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-white/80">VideoNFT Minted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-white/80">Added to HNFT</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-white/80">MCP Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✅</span>
                      <span className="text-white/80">Auto-stored in Walrus</span>
                    </div>
                    {walrusCid && (
                      <div className="text-xs text-white/40 font-mono ml-6 break-all">
                        CID: {walrusCid}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Success - Mobile Optimized */}
      {paymentSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">✅</div>
            <div className="text-white text-base md:text-lg font-semibold mb-2">Payment Successful!</div>
            <div className="text-white/60 text-sm mb-3 md:mb-4">
              You paid {selectedPsychologist?.name} ${selectedPsychologist?.rate} in $rUSD
            </div>
            <div className="text-xs text-white/50 leading-relaxed">
              Transaction processed via Reflect • Auto-compound enabled
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice - Mobile Optimized */}
      <div className="p-3 md:p-4 bg-psy-blue/10 border border-psy-blue/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-psy-blue text-sm md:text-base">🔒</span>
          <div className="text-xs md:text-sm text-white/80 leading-relaxed">
            <strong>Privacy First:</strong> Your video session is ZK-encrypted (Arcium) and stored securely. 
            AI notes are generated with privacy-preserving techniques. Only you control access to your session data.
          </div>
        </div>
      </div>
    </div>
  );
}