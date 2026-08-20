import { FaFacebook, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="anchor-section section border-t border-line">
      <span className="label-caps text-stamp">যোগাযোগ</span>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        আমাদের সাথে যোগাযোগ করুন
      </h2>
      <p className="mt-4 max-w-xl font-body text-ink-muted">
        কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রস্তাব থাকলে নিচের যেকোনো
        মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <FaPhone className="mt-1 text-stamp" />
          <div>
            <p className="label-caps">ফোন</p>
            <p className="mt-1 font-body text-sm text-ink-muted">
              +৮৮০ ১XXX-XXXXXX
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaEnvelope className="mt-1 text-stamp" />
          <div>
            <p className="label-caps">ইমেইল</p>
            <p className="mt-1 font-body text-sm text-ink-muted">
              info@example.org
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="mt-1 text-stamp" />
          <div>
            <p className="label-caps">ঠিকানা</p>
            <p className="mt-1 font-body text-sm text-ink-muted">
              ঢাকা, বাংলাদেশ
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <p className="label-caps">সোশ্যাল মিডিয়া</p>
            <div className="mt-2 flex gap-4 text-lg text-stamp">
              <a href="#" aria-label="Facebook" className="hover:text-marigold">
                <FaFacebook />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-marigold">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
