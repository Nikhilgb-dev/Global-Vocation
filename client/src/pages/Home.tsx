import React from 'react';
import { Search, Star, Clock, Users, BookOpen } from 'lucide-react';

export default function EduleLanding() {
  const courses = [
    {
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
      instructor: "Jason Williams",
      category: "Science",
      categoryColor: "bg-blue-100 text-blue-600",
      title: "Data Science and Machine Learning with Python - Hands On!",
      duration: "09 hr 30 mins",
      students: "29 Lectures",
      price: "$385.00",
      oldPrice: "$440.00",
      rating: 4.9
    },
    {
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      instructor: "Pariah Foster",
      category: "Science",
      categoryColor: "bg-blue-100 text-blue-600",
      title: "Create Amazing Color Schemes for Your UX Design Projects",
      duration: "08 hr 15 mins",
      students: "29 Lectures",
      price: "$420.00",
      oldPrice: null,
      rating: 4.9
    },
    {
      img: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      instructor: "Ross Simmons",
      category: "Science",
      categoryColor: "bg-blue-100 text-blue-600",
      title: "Culture & Leadership: Strategies for a Successful Business",
      duration: "09 hr 10 mins",
      students: "29 Lectures",
      price: "$295.00",
      oldPrice: "$340.00",
      rating: 4.9
    },
    {
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      instructor: "Jason Williams",
      category: "Finance",
      categoryColor: "bg-purple-100 text-purple-600",
      title: "Finance Series: Learn to Budget and Calculate your Net Worth.",
      duration: "04 hr 30 mins",
      students: "29 Lectures",
      price: "Free",
      oldPrice: null,
      rating: 4.9
    },
    {
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
      instructor: "Jason Williams",
      category: "Marketing",
      categoryColor: "bg-pink-100 text-pink-600",
      title: "Build Brand Into Marketing: Tackling the New Marketing Landscape",
      duration: "09 hr 30 mins",
      students: "29 Lectures",
      price: "$136.00",
      oldPrice: null,
      rating: 4.9
    },
    {
      img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
      instructor: "Jason Williams",
      category: "Design",
      categoryColor: "bg-green-100 text-green-600",
      title: "Graphic Design: Illustrating Badges and Icons with Geometric Shapes",
      duration: "07 hr 30 mins",
      students: "29 Lectures",
      price: "$237.00",
      oldPrice: null,
      rating: 4.9
    }
  ];

  const categories = [
    "UI/UX Design",
    "Development",
    "Data Science",
    "Business",
    "Financial",
    "Marketing"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden  p-10">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
            </div>

            <p className="text-gray-600 mb-2">Start your favourite course</p>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Now learning from<br />
              anywhere, and build<br />
              your <span className="text-green-600 relative">
                bright career
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4 Q 100 8 200 4" stroke="#10b981" strokeWidth="2" fill="none" />
                </svg>
              </span>.
            </h1>

            <p className="text-gray-600 mb-6">
              It has survived not only five centuries but also<br />
              the leap into electronic typesetting.
            </p>

            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Start A Course
            </button>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"
              alt="Student with laptop"
              className="w-full h-auto relative z-10"
            />
            {/* Arrow */}
            <svg className="absolute top-16 right-1/4 w-24 h-24 text-yellow-400" viewBox="0 0 100 100">
              <path d="M10 50 Q 50 10 90 50" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                </marker>
              </defs>
            </svg>

            {/* Green Arrow */}
            <svg className="absolute bottom-32 right-0 w-32 h-32 text-green-500" viewBox="0 0 100 100">
              <path d="M90 10 Q 50 50 10 90" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            {/* Decorative dots */}
            <div className="absolute bottom-8 left-8">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-2">
          All <span className="text-green-600 relative">
            Courses
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 120 6">
              <path d="M0 3 Q 60 6 120 3" stroke="#10b981" strokeWidth="2" fill="none" />
            </svg>
          </span> of Edule
        </h2>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8 mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your course"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 justify-center flex-wrap">
          <button className="px-2 py-1 text-2xl">‹</button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${idx === 0 ? 'bg-green-600 text-white' : 'border border-gray-300 hover:border-green-600'
                }`}
            >
              {cat}
            </button>
          ))}
          <button className="px-2 py-1 text-2xl">›</button>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={course.img} alt={course.title} className="w-full h-48 object-cover" />

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${course.categoryColor}`}>
                    {course.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">{course.price}</span>
                    {course.oldPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">{course.oldPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">{course.rating}</span>
                    <div className="flex text-yellow-400">
                      {'★★★★★'.split('').map((star, i) => (
                        <span key={i} className="text-xs">{star}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition">
            Other Course
          </button>
        </div>
      </section>

      {/* Instructor CTA */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <p className="text-green-600 mb-2">Become A Instructor</p>
            <h2 className="text-3xl font-bold mb-4">
              You can join with Edule<br />
              as a <span className="text-green-600 relative">
                instructor
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 150 6">
                  <path d="M0 3 Q 75 6 150 3" stroke="#10b981" strokeWidth="2" fill="none" />
                </svg>
              </span>?
            </h2>
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Drop Information
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-8 right-8">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}