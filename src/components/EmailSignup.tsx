
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const EmailSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEarlyAccess, setIsEarlyAccess] = useState(false);
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Show early access option only when user has typed at least 5 characters
    if (e.target.value.length >= 5) {
      setShowEarlyAccess(true);
    } else {
      setShowEarlyAccess(false);
      setIsEarlyAccess(false); // Reset early access when hiding
    }
  };

  const handleEarlyAccessToggle = () => {
    setIsEarlyAccess(!isEarlyAccess);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Always store in notify table
      const { error: notifyError } = await supabase
        .from('notify')
        .insert({ email });

      if (notifyError) {
        console.error('Error inserting into notify table:', notifyError);
        throw notifyError;
      }

      // If early access is selected, also store in notify_test table
      if (isEarlyAccess) {
        const { error: notifyTestError } = await supabase
          .from('notify_test')
          .insert({ email });

        if (notifyTestError) {
          console.error('Error inserting into notify_test table:', notifyTestError);
          throw notifyTestError;
        }
      }

      const message = isEarlyAccess 
        ? "Mulțumim! Te vom contacta cu 48h înaintea lansării oficiale pentru accesul prioritar." 
        : "Mulțumim! Te vom notifica când site-ul va fi gata.";
      
      toast.success(message);
      setEmail("");
      setIsEarlyAccess(false);
      setShowEarlyAccess(false);
    } catch (error) {
      console.error('Error storing email:', error);
      toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pointer-events-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input 
          type="email" 
          placeholder="Adresa ta de email" 
          value={email} 
          onChange={handleEmailChange} 
          className="h-12 md:h-14 text-base md:text-lg bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl px-4 md:px-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg pointer-events-auto" 
          required 
          disabled={isSubmitting}
        />
        
        {/* Progressive Early Access Option - Only show when not activated */}
        <div className={`transition-all duration-500 ease-out overflow-hidden ${showEarlyAccess && !isEarlyAccess ? 'max-h-20 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'}`}>
          <div className="pb-2">
            <button 
              type="button" 
              onClick={handleEarlyAccessToggle} 
              className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 w-full text-left border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300 hover:bg-white/80 pointer-events-auto"
              disabled={isSubmitting}
            >
              <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 border-gray-300">
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">✨ Vreau acces prioritar! ✨ </span>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button with Checkbox when Early Access is Active */}
        <div className="flex items-center gap-3">
          {/* Checkbox appears to the left when early access is active */}
          {isEarlyAccess && (
            <button 
              type="button" 
              onClick={handleEarlyAccessToggle} 
              className="flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-200 border-blue-500 bg-blue-500 pointer-events-auto"
              disabled={isSubmitting}
            >
              <Check className="w-4 h-4 text-white" />
            </button>
          )}
          
          <Button 
            type="submit" 
            className={`h-12 md:h-14 text-base md:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 pointer-events-auto ${isEarlyAccess ? 'flex-1' : 'w-full'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Se procesează..." : "Anunță-mă când e disponibil"}
          </Button>
        </div>
      </form>
    </div>
  );
};
