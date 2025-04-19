import React from 'react';
import { Link } from 'react-router-dom';
import { Percent, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  yield: number;
  type: string;
  price: number;
  raised: number;
  image: string;
  status: string;
  daysLeft?: number;
  investors?: number;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  yield: yieldPercentage,
  type,
  price,
  raised,
  image,
  status,
  daysLeft,
  investors,
  featured = false,
}) => {
  const fundingPercentage = (raised / price) * 100;
  
  return (
    <Card 
      variant="sunset" 
      hover 
      animated 
      className={`overflow-hidden ${featured ? 'border-2 border-secondary-300' : ''}`}
      glow
    >
      <div className="relative">
        <div className="h-48 w-full relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-dark to-transparent opacity-60"></div>
          {featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="sunset" size="md">Featured</Badge>
            </div>
          )}
          <div className={`absolute top-3 right-3 ${
            status === 'Funded' ? 'bg-green-500' : 'bg-secondary-500'
          } text-white px-2.5 py-1 rounded-md text-sm font-medium`}>
            {status}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <Badge variant={yieldPercentage > 8 ? 'success' : 'info'} className="mb-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {yieldPercentage}% Yield
          </Badge>
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <div className="flex items-center mt-1 text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-300" />
            <span className="text-gray-200">{location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-night-dark to-primary-900">
        <div className="flex justify-between items-center mb-3">
          <Badge variant={type === 'Residential' ? 'info' : type === 'Commercial' ? 'primary' : 'warning'}>
            {type}
          </Badge>
          <div className="text-sm text-gray-300 flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            {investors || '0'} investors
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300 font-medium">{fundingPercentage.toFixed(0)}% funded</span>
            {daysLeft !== undefined && (
              <span className="text-gray-300 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {daysLeft} days left
              </span>
            )}
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
              <div
                style={{ width: `${fundingPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-gray-300">${(raised / 1000000).toFixed(1)}M raised</span>
            <span className="text-gray-100 font-medium">${(price / 1000000).toFixed(1)}M goal</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link to={`/properties/${id}`}>
            <Button
              variant="gradient"
              size="md"
              fullWidth
              animated
              glow
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;