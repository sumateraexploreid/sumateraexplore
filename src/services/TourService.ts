import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Service to handle Tour related database operations using Supabase.
 */
export class TourService {
  /**
   * Helper to get authenticated or unauthenticated supabase client
   */
  private static async getClient() {
    const cookieStore = await cookies();
    return createClient(cookieStore);
  }

  /**
   * Get CMS Tour Settings.
   */
  static async getTourSettings() {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'cms_tour')
      .single();

    return data?.value || {};
  }

  /**
   * Get featured active tour packages.
   */
  static async getFeaturedPackages() {
    const supabase = await this.getClient();
    let { data: featured } = await supabase
      .from('packages')
      .select(`
        *,
        package_images(*),
        cities(*)
      `)
      .eq('status', 'active')
      .eq('isFeatured', true)
      .order('sortOrder', { ascending: true });

    if (!featured || featured.length === 0) {
      const { data: allActive } = await supabase
        .from('packages')
        .select(`
          *,
          package_images(*),
          cities(*)
        `)
        .eq('status', 'active')
        .order('sortOrder', { ascending: true });
      return allActive || [];
    }

    return featured;
  }

  /**
   * Get tour blog posts.
   */
  static async getBlogs(limit?: number) {
    const supabase = await this.getClient();
    let query = supabase
      .from('blogs')
      .select('*, cover_image:media(*)') // Assuming coverImage is related to media
      .eq('status', 'published')
      .order('createdAt', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data } = await query;
    return data || [];
  }

  /**
   * Get all active tour packages.
   */
  static async getAllPackages() {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('packages')
      .select(`
        *,
        package_images(*),
        cities(*)
      `)
      .eq('status', 'active')
      .order('sortOrder', { ascending: true });

    return data || [];
  }

  /**
   * Slim package list for the navbar dropdown.
   */
  static async getNavPackages() {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('packages')
      .select('id, slug, name, duration, translations')
      .eq('status', 'active')
      .order('sortOrder', { ascending: true });

    return data || [];
  }

  /**
   * Get all cities.
   */
  static async getCities() {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true });

    return data || [];
  }

  /**
   * Get active gallery images for Tour.
   */
  static async getGallery() {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('gallery_images')
      .select('*, media(*)')
      .eq('isActive', true)
      .order('orderPriority', { ascending: true });

    return data || [];
  }

  /**
   * Get active package by slug.
   */
  static async getPackageBySlug(slug: string) {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('packages')
      .select(`
        *,
        package_images(*),
        cities(*)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    return data;
  }

  /**
   * Get active blog post by slug.
   */
  static async getBlogPost(slug: string) {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    return data;
  }

  /**
   * Get related blog posts (any category).
   */
  static async getRelatedBlogs(currentId: string | number, limit = 3) {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('blogs')
      .select('*, cover_image:media(*)')
      .eq('status', 'published')
      .neq('id', currentId)
      .order('createdAt', { ascending: false })
      .limit(limit);

    return data || [];
  }
}
