import { Venture } from '../types/models';

export const mockVentures: Venture[] = [
  {
    id: "1",
    name: "Eco-Friendly Packaging",
    description: "Sustainable packaging solutions for e-commerce businesses",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    v_token_amount: 1000000,
    end_date: "2024-12-31",
    category: "Sustainability",
    created_at: "2024-01-01",
    members: [
      {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        image_url: "https://randomuser.me/api/portraits/men/1.jpg",
        created_at: "2024-01-01",
        role: "superuser"
      },
      {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        image_url: "https://randomuser.me/api/portraits/women/1.jpg",
        created_at: "2024-01-01",
        role: "user"
      },
      {
        id: "user3",
        name: "Mike Johnson",
        email: "mike@example.com",
        image_url: "https://randomuser.me/api/portraits/men/2.jpg",
        created_at: "2024-01-01",
        role: "user"
      },
      {
        id: "user4",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        image_url: "https://randomuser.me/api/portraits/women/2.jpg",
        created_at: "2024-01-01",
        role: "user"
      },
      {
        id: "user5",
        name: "David Brown",
        email: "david@example.com",
        image_url: "https://randomuser.me/api/portraits/men/3.jpg",
        created_at: "2024-01-01",
        role: "user"
      },
      {
        id: "user6",
        name: "Emily Davis",
        email: "emily@example.com",
        image_url: "https://randomuser.me/api/portraits/women/3.jpg",
        created_at: "2024-01-01",
        role: "user"
      }
    ]
  },
  {
    id: "2",
    name: "AI-Powered Analytics",
    description: "Advanced analytics platform for business intelligence",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    v_token_amount: 2000000,
    end_date: "2024-12-31",
    category: "Technology",
    created_at: "2024-01-15",
    members: [
      {
        id: "user7",
        name: "Alex Turner",
        email: "alex@example.com",
        image_url: "https://randomuser.me/api/portraits/men/4.jpg",
        created_at: "2024-01-15",
        role: "superuser"
      },
      {
        id: "user8",
        name: "Lisa Chen",
        email: "lisa@example.com",
        image_url: "https://randomuser.me/api/portraits/women/4.jpg",
        created_at: "2024-01-15",
        role: "user"
      },
      {
        id: "user9",
        name: "Robert Kim",
        email: "robert@example.com",
        image_url: "https://randomuser.me/api/portraits/men/5.jpg",
        created_at: "2024-01-15",
        role: "user"
      }
    ]
  },
  {
    id: "3",
    name: "Urban Farming Initiative",
    description: "Vertical farming solutions for urban environments",
    image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    v_token_amount: 1500000,
    end_date: "2024-12-31",
    category: "Agriculture",
    created_at: "2024-02-01",
    members: [
      {
        id: "user10",
        name: "Maria Garcia",
        email: "maria@example.com",
        image_url: "https://randomuser.me/api/portraits/women/5.jpg",
        created_at: "2024-02-01",
        role: "superuser"
      },
      {
        id: "user11",
        name: "James Wilson",
        email: "james@example.com",
        image_url: "https://randomuser.me/api/portraits/men/6.jpg",
        created_at: "2024-02-01",
        role: "user"
      },
      {
        id: "user12",
        name: "Sophia Lee",
        email: "sophia@example.com",
        image_url: "https://randomuser.me/api/portraits/women/6.jpg",
        created_at: "2024-02-01",
        role: "user"
      },
      {
        id: "user13",
        name: "Daniel Park",
        email: "daniel@example.com",
        image_url: "https://randomuser.me/api/portraits/men/7.jpg",
        created_at: "2024-02-01",
        role: "user"
      }
    ]
  }
]; 